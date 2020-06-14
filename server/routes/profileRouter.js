const express = require("express");
const path = require("path");
const router = express.Router();
const userDetailHandler = require("../models/userDetailsHandler");
const db = require("../models/DBConfiguration");
const validator = require("../validator");

router.get("/", (req, res) => {
  res.redirect(`http://localhost:5000/profile/${req.cookies.userName}`);
});

router.get("/:userName", (req, res) => {
  validator.validateUser(req, res);
  res.sendFile(path.resolve(__dirname + "/../../ui/profile.html"));
});

router.get("/:userName/userDetails", (req, res) => {
  validator.validateUser(req, res);
  userDetailHandler.sendDetailsOfUsers(res, req.params.userName, "username");
});

router.get("/:userID/userTweets", (req, res) => {
  validator.validateUser(req, res);
  db.getConnection((err, conn) => {
    if (err) {
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `select * from tweet where user_id= ${req.params.userID} order by timeStamp desc`,
      function (queryError, result) {
        if (queryError) {
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        }
        res.send(result);
      }
    );
    conn.release();
  });
});

router.get("/:tweetID/tweetHashTagCollection", (req, res) => {
  validator.validateUser(req, res);
  db.getConnection((err, conn) => {
    if (err) {
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `select * from hashtagcollection where tweet_id= ${req.params.tweetID}`,
      function (queryError, result) {
        if (queryError) {
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        }
        res.send(result);
      }
    );
    conn.release();
  });
});

router.get("/:hashTagID/tweetHashTag", (req, res) => {
  validator.validateUser(req, res);
  db.getConnection((err, conn) => {
    if (err) {
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `select * from hashTag where ht_id= ${req.params.hashTagID}`,
      function (queryError, result) {
        if (queryError) {
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        }
        res.send(result);
      }
    );
    conn.release();
  });
});

router.get("/:userID/getFollowers", (req, res) => {
  validator.validateUser(req, res);
  db.getConnection((err, conn) => {
    if (err) {
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `select * from Follower where following_user_id= ${req.params.userID} order by follower_id asc`,
      function (queryError, result) {
        if (queryError) {
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        }
        res.send(result);
      }
    );
    conn.release();
  });
});

router.get("/:userID/getFollowings", (req, res) => {
  validator.validateUser(req, res);
  db.getConnection((err, conn) => {
    if (err) {
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `select * from Follower where follower_user_id= ${req.params.userID} order by follower_id asc`,
      function (queryError, result) {
        if (queryError) {
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        }
        res.send(result);
      }
    );
    conn.release();
  });
});

router.get("/:userID/:tweetID/:comment/storeComment", (req, res) => {
  validator.validateUser(req, res);
  var user_id = req.params.userID;
  var tweet_id = req.params.tweetID;
  var text = req.params.comment;

  db.getConnection(function (err, conn) {
    if (err) {
      res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `insert into comment (user_id, tweet_id, text) values (${user_id},${tweet_id},${text})`,
      function (queryError, result1) {
        if (queryError) {
          console.log(queryError);
          res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        } else {
          res.send(200);
        }
      }
    );
  });
});

router.get("/:userID/getUserDetailsFromUID", (req, res) => {
  validator.validateUser(req, res);
  db.getConnection((err, conn) => {
    if (err) {
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `select * from users where user_id= ${req.params.userID}`,
      function (queryError, result) {
        if (queryError) {
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        }
        res.send(result);
      }
    );
    conn.release();
  });
});

router.get("/:userID/:tweetID/like", (req, res) => {
  validator.validateUser(req, res);
  db.getConnection(function (err, conn) {
    if (err) {
      res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `select * from likes where user_id = ${req.params.userID} and tweet_id = ${req.params.tweetID}`,
      function (queryError, result1) {
        if (queryError) {
          console.log(queryError);
          res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        } else {
          console.log(result1.length);
          if (result1.length !== 0) {
            res.send(result1);
          } else {
            conn.query(
              `insert into likes (user_id, tweet_id, timeStamp) values (${req.params.userID},${req.params.tweetID}, CURRENT_TIMESTAMP)`,
              function (queryError, result1) {
                if (queryError) {
                  console.log(queryError);
                  res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
                } else {
                  res.send(201);
                }
              }
            );
          }
        }
      }
    );
  });
});

router.get("/:userID/:tweetID/:retweet/storeRetweet", (req, res) => {
  validator.validateUser(req, res);
  var user_id = req.params.userID;
  var tweet_id = req.params.tweetID;
  var text = req.params.retweet;

  db.getConnection(function (err, conn) {
    if (err) {
      res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `insert into tweet (user_id, tweetText) values (${user_id},${text})`,
      function (queryError, result1) {
        if (queryError) {
          console.log(queryError);
          res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        } else {
          conn.query(
            `insert into retweet (user_id, tweet_id) values(${user_id},${tweet_id})`,
            function (queryError, result1) {
              if (queryError) {
                console.log(queryError);
                res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
              } else {
                res.send(200);
              }
            }
          );
        }
      }
    );
  });
});

router.get("/:searchInput/search", (req, res) => {
  validator.validateUser(req, res);
  db.getConnection((err, conn) => {
    if (err) {
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `select * from users where username= '${req.params.searchInput}'`,
      function (queryError, result) {
        if (queryError) {
          console.log(queryError);
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        } else {
          if (result.length != 0) {
            res.send(result);
          } else {
            console.log(req.params.searchInput);
            sql =
              "SELECT username, fullname, tweet_id, tweetText, timeStamp FROM twitter_clone.users, twitter_clone.tweet where twitter_clone.tweet.user_id = twitter_clone.users.user_id AND tweetText like ('%" +
              req.params.searchInput +
              "%') order by timeStamp desc";
            conn.query(sql, function (queryError, result) {
              if (queryError) {
                console.log(queryError);
                res
                  .status(500)
                  .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
              } else {
                res.send(result);
              }
            });
          }
        }
      }
    );
    conn.release();
  });
});

router.get("/:followerID/:followingID/unfollow", (req, res) => {
  validator.validateUser(req, res);
  db.getConnection((err, conn) => {
    if (err) {
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      `delete from Follower where following_user_id= ${req.params.followingID} and follower_user_id= ${req.params.followerID}`,
      function (queryError, result) {
        if (queryError) {
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        }
        res.send(200);
      }
    );
    conn.release();
  });
});

router.get("/:followerID/:followingID/follow", (req, res) => {
  validator.validateUser(req, res);
  db.getConnection((err, conn) => {
    if (err) {
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }

    console.log(req.params.followerID);
    console.log(req.params.followingID);
    conn.query(
      `insert into Follower (follower_user_id, following_user_id) values (${req.params.followerID},${req.params.followingID})`,
      function (queryError, result) {
        if (queryError) {
          console.log(queryError);
          res
            .status(500)
            .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        }
        res.send(200);
      }
    );
    conn.release();
  });
});

module.exports = router;
