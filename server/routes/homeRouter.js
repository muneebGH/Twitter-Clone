const homeHandler = require("../models/homeHandler");
const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");

app.get("/like", (req, res) => {
  homeHandler.doLike(req, res, req.cookies.uid);
});

app.get("/follow", (req, res) => {
  homeHandler.doFollow(req, res, req.cookies.uid);
});

app.get("/storeComment", (req, res) => {
  homeHandler.storeComment(req, res, req.cookies.uid);
});

app.get("/retweet", (req, res) => {
  homeHandler.doRetweet(req, res, req.cookies.uid);
});

app.get("/doSearch", (req, res) => {
  homeHandler.doSearch(req, res, req.cookies.uid, true);
});

app.get("/storeTweet", (req, res) => {
  homeHandler.storeTweet(req, res, req.cookies.uid);
});

app.get("/", (req, res, next) => {
  if (req.query.search === undefined || req.query.search === "") {
    homeHandler.displayHome(req, res, req.cookies.uid, false);
  } else {
    homeHandler.displayHome(req, res, req.cookies.uid, true);
  }
});

module.exports = app;
