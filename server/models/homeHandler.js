const DBConfiguration = require("./DBConfiguration");
const url = require("url");
const path = require("path");

function storeComment(req, res, uid) {
  if (req.query.newTweet === "") {
    res.redirect("/home");
  } else {
    DBConfiguration.getConnection(function (err, conn) {
      if (err) {
        res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
      }
      var i;
      for (i = 0; i < req.query.newComment.length; i++) {
        if (req.query.newComment[i] != "") {
          break;
        }
      }

      conn.query(
        "insert into comment (user_id, tweet_id, text) values(" +
          uid +
          ", " +
          req.query.tweet_id[i] +
          ", '" +
          req.query.newComment[i] +
          "')",
        function (queryError, result1) {
          if (queryError) {
            console.log(queryError);
            res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
          } else {
            res.redirect("/home");
          }
        }
      );
    });
  }
}

function doLike(req, res, uid) {
  DBConfiguration.getConnection(function (err, conn) {
    if (err) {
      res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      "select * from likes where user_id = " +
        uid +
        " and tweet_id = " +
        req.query.tweet_id +
        ";",
      function (queryError, result1) {
        if (queryError) {
          console.log(queryError);
          res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        } else {
          console.log(result1.length);
          if (result1.length !== 0) {
            conn.query(
              "delete from likes where user_id="+uid+" and tweet_id="+req.query.tweet_id,
              function (queryError, result1) {
                if (queryError) {
                  console.log(queryError);
                  res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
                } else {
                  console.log("here");
                  res.redirect("/home");
                }
              }
            );
          } else {
            conn.query(
              "insert into likes (user_id, tweet_id, timeStamp) values(" +
                uid +
                "," +
                req.query.tweet_id +
                ", CURRENT_TIMESTAMP)",
              function (queryError, result1) {
                if (queryError) {
                  console.log(queryError);
                  res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
                } else {
                  res.redirect("/home");
                }
              }
            );
          }
        }
      }
    );
  });
}

function doRetweet(req, res, uid) {
  console.log(req.query.tweetText);
  console.log(req.query.tweet_id);
  DBConfiguration.getConnection(function (err, conn) {
    if (err) {
      res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    conn.query(
      "insert into tweet (user_id, tweetText) values(" +
        uid +
        ",'" +
        req.query.tweetText +
        "')",
      function (queryError, result1) {
        if (queryError) {
          console.log(queryError);
          res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
        } else {
          conn.query(
            "insert into retweet (user_id, tweet_id) values(" +
              uid +
              "," +
              req.query.tweet_id +
              ")",
            function (queryError, result1) {
              if (queryError) {
                console.log(queryError);
                res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
              } else {
                res.redirect("/home");
              }
            }
          );
        }
      }
    );
  });
}

function storeTweet(req, res, uid) {
  if (req.query.newTweet === "") {
    res.redirect("/home");
  } else {
    DBConfiguration.getConnection(function (err, conn) {
      if (err) {
        res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
      }

      conn.query(
        "insert into tweet (user_id, tweetText) values(" +
          uid +
          ",'" +
          req.query.newTweet +
          "')",
        function (queryError, result1) {
          var userDetails;
          if (queryError) {
            console.log(queryError);
            res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
          } else {
            res.redirect("/home");
          }
        }
      );
    });
  }
}

function displayHome(req, res, uid, search) {
  DBConfiguration.getConnection(function (err, conn) {
    if (err) {
      res.status.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }
    var user;
    conn.query("select * from users where user_id=" + uid, function (
      queryError,
      result1
    ) {
      if (queryError) {
        res.sendFile(path.resolve(__dirname + "/../../ui/500.html"));
      } else {
        conn.query(
          "select count(follower_user_id) as count from twitter_clone.follower where follower_user_id = " +
            uid +
            " union all select count(following_user_id) from twitter_clone.follower where following_user_id = " +
            uid +
            ";",
          function (queryError, result2) {
            if (queryError) {
              res.status.sendFile(
                path.resolve(__dirname + "/../../ui/500.html")
              );
            } else {
              conn.query(
                "select t.tweet_id, t.timeStamp, t.tweetText, u.username, u.fullname from twitter_clone.tweet as t, twitter_clone.users as u where t.tweet_id = ANY (select tweet_id from (SELECT tweet_id, count(tweet_id) as likesCount FROM twitter_clone.likes group by tweet_id order by likesCount desc limit 3) as ids) AND t.user_id = u.user_id;",
                function (queryError, result3) {
                  if (queryError) {
                    res.sendFile(
                      path.resolve(__dirname + "/../../ui/500.html")
                    );
                  } else {
                    var sql;
                    if (search === true) {
                      sql =
                        "SELECT username, fullname, tweet_id, tweetText, timeStamp FROM twitter_clone.users, twitter_clone.tweet where twitter_clone.tweet.user_id = twitter_clone.users.user_id AND tweetText like ('%" +
                        req.query.search +
                        "%') order by timeStamp desc";
                    } else {
                      sql =
                        "SELECT username, fullname, tweet_id, tweetText, timeStamp FROM twitter_clone.users, twitter_clone.tweet where twitter_clone.tweet.user_id = twitter_clone.users.user_id order by timeStamp desc limit 100;";
                    }
                    conn.query(sql, function (queryError, result4) {
                      if (queryError) {
                        res.sendFile(
                          path.resolve(__dirname + "/../../ui/500.html")
                        );
                      } else {
                        conn.query(
                          //query5
                          "select c.tweet_id, c.user_id, c.text, c.time, u.username from comment c, users u where c.user_id = u.user_id order by c.time desc limit 50;",
                          function (queryError, result5) {
                            if (queryError) {
                              console.log(queryError);
                              res.sendFile(
                                path.resolve(__dirname + "/../../ui/500.html")
                              );
                            } else {
                                    conn.query(
                                    //query6
                                    "SELECT tweet_id FROM likes where user_id="+ uid,
                                    function (queryError, result6) {
                                      if (queryError) {
                                        console.log(queryError);
                                        res.sendFile(
                                          path.resolve(__dirname + "/../../ui/500.html")
                                        );
                                      } else {
                                      var userDetails = {
                                        name: result1[0].username,
                                        desc: result1[0].description,
                                        fullname: result1[0].fullname,
                                        followersCount: result2[0].count,
                                        followingsCount: result2[1].count,
                                        accountType: result1[0].account_Type,
                                      };
                                      var tweets = [];
                                      var comments = [];
                                      var trends = [];
                                      var likes = [];

                                      Object.keys(result4).forEach(function (key) {
                                        var row = result4[key];
                                        var tweet = {
                                          tweet_id: row.tweet_id,
                                          username: row.username,
                                          fullname: row.fullname,
                                          time: row.timeStamp,
                                          text: row.tweetText,
                                        };
                                        tweets.push(tweet);
                                      }); //tweets loop

                                      Object.keys(result5).forEach(function (key1) {
                                        var row1 = result5[key1];
                                        var comment = {
                                          comTweetId: row1.tweet_id,
                                          comUserId: row1.user_id,
                                          comUserName: row1.username,
                                          comText: row1.text,
                                          comTime: row1.time,
                                        };
                                        comments.push(comment);
                                      }); //comments loop

                                      
                                      Object.keys(result3).forEach(function (key2) {
                                        var row2 = result3[key2];
                                        var trend = {
                                          tweet_id: row2.tweet_id,
                                          username: row2.username,
                                          fullname: row2.fullname,
                                          time: row2.timeStamp,
                                          text: row2.tweetText,
                                        };
                                        trends.push(trend);
                                      }); //trends loop
                                      Object.keys(result6).forEach(function (key3) {
                                        likes.push(result6[key3].tweet_id);
                                      }); //likes loop
                                      console.log(likes);
                                      res.render(
                                        path.resolve(__dirname + "/../../views/home"),
                                        {
                                          userDetails: userDetails,
                                          comments: comments,
                                          tweets: tweets,
                                          trends: trends,
                                          likes:likes
                                        }
                                      );//render
                                  }//else6
                               });//query5
                            } //else5
                          }); //query5
                      } //else4
                    }); //query4
                  } //else3
                }); //query3
            } //else2
          }); //query2
      } //else1
    }); //query1
    conn.release();
  });
}

module.exports = {
  displayHome: displayHome,
  storeTweet: storeTweet,
  doLike: doLike,
  storeComment: storeComment,
  doRetweet: doRetweet,
};
