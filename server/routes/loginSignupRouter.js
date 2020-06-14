const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    if (req.cookies.userName) {
      res.redirect("http://localhost:5000/home");
    } else {
      res.redirect("http://localhost:5000/login");
    }
  } catch (error) {
    res.redirect("http://localhost:5000/login");
  }
});

router.get("/login", (req, res) => {
  clearCookies(res);
  res.sendFile(path.resolve(__dirname + "/../../ui/login.html"));
});

router.get("/signup", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/../../ui/create_acc.html"));
});

router.post("/createUser", (req, res) => {
  require("../models/userCreationHandler").createNewuser(req.body);
  res.redirect("/login");
});

router.get("/validateUser", async (req, res) => {
  clearCookies(res);
  require("../models/DBConfiguration").getConnection(
    //callback for get connection
    (connectionError, connection) => {
      validateUser(connectionError, connection, req, res);
    }
  );
});

function validateUser(connectionError, connection, req, res) {
  //throw error if there is error in making connection
  if (connectionError) {
    throw connectionError;
  }
  //if there is no error then perform query
  //pass query as first parameter and callback as 2nd
  connection.query(
    `select * from Users where username='${req.param(
      "userName"
    )}' and password='${req.param("password")}'`,
    (err, result) => {
      manageValidateUserResult(err, result, res);
    }
  ); //callback after query execution end
  //release the connection after query
  connection.release();
}
function clearCookies(res) {
  try {
    res.clearCookie("userName");
    res.clearCookie("accountType");
    res.clearCookie("uid");
    res.clearCookie("fullName");
    res.clearCookie("currentCID");
    res.clearCookie("convoUser1");
    res.clearCookie("convoUser2");
    res.clearCookie("chatWith");
    res.clearCookie("convoWith");
    res.clearCookie("CID");
  } catch (error) {}
}

function setCookies(res, result) {
  res.cookie("userName", result.username);
  res.cookie("fullName", result.fullname);
  res.cookie("accountType", result.account_Type);
  res.cookie("uid", result.user_id);
}

function manageValidateUserResult(err, result, res) {
  //object to send back to client
  var userToSend = {
    userName: "none",
    uid: "none",
    fullName: "none",
    accountType: "none",
  };

  //callback after execution of query
  if (err) {
    //if there is error in executing the query
    res.send(userToSend);
  }
  try {
    if (result[0] != undefined) {
      userToSend.userName = result[0].username;
      userToSend.uid = result[0].user_id;
      userToSend.accountType = result[0].account_type;
      userToSend.fullName = result[0].fullname;
      setCookies(res, result[0]);
      res.send(userToSend);
    } else {
      res.send(userToSend);
    }
  } catch (error) {
    res.send(userToSend);
  }
}
module.exports = router;
