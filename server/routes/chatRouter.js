const express = require("express");
const path = require("path");
const chatHandler = require("../models/chatHandler");
const userDetailHandler = require("../models/userDetailsHandler");
const validator = require("../validator");
const router = express.Router();

router.get("/", (req, res) => {
  validator.validateUser(req, res);
  res.cookie("chatWith", req.param("chatWith"));
  res.sendFile(path.resolve(__dirname + "/../../ui/chat.html"));
});

router.get("/conversationsOfUser", async (req, res) => {
  chatHandler.sendConversationsOfUser(req, res, req.cookies.uid);
});

router.get("/detailsOfUsers", async (req, res) => {
  userDetailHandler.sendDetailsOfUsers(res, req.param("data"), req.param("on"));
});

router.get("/createConversation", (req, res) => {
  chatHandler.createConversation(req, res);
});

router.get("/getConversationID", (req, res) => {
  chatHandler.getConversationID(req, res);
});

router.get("/getMessagesOfCID", (req, res) => {
  chatHandler.getMessagesOfCID(req, res);
});

router.get("/userFromID", (req, res) => {
  chatHandler.getUserFromID(req, res);
});

router.get("/addMessage", (req, res) => {
  chatHandler.addMessage(req, res);
});
module.exports = router;
