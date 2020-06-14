const DBConfiguration = require("./DBConfiguration");
const path = require("path");

async function sendConversationsOfUser(req, res, uid) {
  DBConfiguration.getConnection(function (err, conn) {
    if (err) {
      console.log(`error in connecting while getting conversations : ${err}`);
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
      return;
    }

    conn.query(
      `select * from Conversations where user_one=${uid} or user_two=${uid}`,
      function (queryError, result) {
        if (queryError) {
          console.log(`error in query while getting conversations : ${err}`);
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
          return;
        }

        res.send(result);
      }
    );
    conn.release();
  });
}

function createConversation(req, res) {
  var userOne = req.param("userOne");
  var userTwo = req.param("userTwo");

  DBConfiguration.getConnection(function (err, conn) {
    if (err) {
      console.log(`error in connecting while getting conversations : ${err}`);
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
      return;
    }

    conn.query(
      `insert into Conversations(user_one,user_two) values(${userOne},${userTwo})`,
      function (queryError, result) {
        if (queryError) {
          console.log(`error in query while getting conversations : ${err}`);
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
          return;
        }

        res.status(200).send(result);
      }
    );
    conn.release();
  });
}
function getConversationID(req, res) {
  var userOne = req.param("userOne");
  var userTwo = req.param("userTwo");

  DBConfiguration.getConnection(function (err, conn) {
    if (err) {
      console.log(`error in connecting while getting conversations : ${err}`);
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
      return;
    }

    conn.query(
      `select * from Conversations where (user_one=${userOne} or user_one=${userTwo}) and (user_two=${userOne} or user_two=${userTwo})`,
      function (queryError, result) {
        if (queryError) {
          console.log(`error in query while getting conversations : ${err}`);
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
          return;
        }

        res.cookie("currentCID", result[0].c_id);

        res.cookie("convoUser1", result[0].user_one);
        res.cookie("convoUser2", result[0].user_two);
        res.status(200).send(result);
      }
    );
    conn.release();
  });
}

function getMessagesOfCID(req, res) {
  var cid = req.param("cid");

  DBConfiguration.getConnection(function (err, conn) {
    if (err) {
      console.log(`error in connecting while getting conversations : ${err}`);
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
      return;
    }

    conn.query(
      `select * from Message where c_id=${cid} order by time`,
      function (queryError, result) {
        if (queryError) {
          console.log(`error in query while getting conversations : ${err}`);
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
          return;
        }

        res.status(200).send(result);
      }
    );
    conn.release();
  });
}

function getUserFromID(req, res) {
  var id = req.param("id");

  DBConfiguration.getConnection(function (err, conn) {
    if (err) {
      console.log(`error in connecting while getting conversations : ${err}`);
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
      return;
    }

    conn.query(`select * from Users where user_id=${id}`, function (
      queryError,
      result
    ) {
      if (queryError) {
        console.log(`error in query while getting conversations : ${err}`);
        res
          .status(500)
          .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        return;
      }

      res.status(200).send(result);
    });
    conn.release();
  });
}

function addMessage(req, res) {
  var text = req.param("text");
  var from = req.param("from");
  var to = req.param("to");
  var cid = req.param("cid");

  DBConfiguration.getConnection(function (err, conn) {
    if (err) {
      console.log(`error in connecting while getting conversations : ${err}`);
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
      return;
    }

    var sql = `insert into message(text,time,sender_id,receiver_id,c_id) values("${text}",now(),${from},${to},${cid});`;
    console.log(sql);
    conn.query(sql, function (queryError, result) {
      if (queryError) {
        console.log(`error in query while adding message query : ${err}`);
        res
          .status(500)
          .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        return;
      }

      res.status(200).send(result);
    });
    conn.release();
  });
}
module.exports = {
  sendConversationsOfUser: sendConversationsOfUser,
  createConversation: createConversation,
  getConversationID: getConversationID,
  getMessagesOfCID: getMessagesOfCID,
  getUserFromID: getUserFromID,
  addMessage: addMessage,
};
