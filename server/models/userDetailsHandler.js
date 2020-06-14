const DBConfiguration = require("./DBConfiguration");
const path = require("path");

//function to send the details of user given array of anything to compare
//it can be a username or list of usernames
//what you want to comapre will be placesd after where
//list will be places in set after in
async function sendDetailsOfUsers(res, listToComapre, what) {
  var uniqueList;
  if (!Array.isArray(listToComapre)) {
    uniqueList = [listToComapre];
  } else {
    uniqueList = [...new Set(listToComapre)];
  }
  console.log(uniqueList);

  var str = uniqueList.join();
  str = str.replace("[", "");
  str = str.replace("]", "");

  console.log(`str ${str} ${what}`);
  DBConfiguration.getConnection(function (err, conn) {
    if (err) {
      res.status(500).sendFile(path.resolve(__dirname + "/../../ui/500.html"));
    }

    conn.query(`select * from Users where ${what} in (${str})`, function (
      queryError,
      result
    ) {
      if (queryError) {
        res
          .status(500)
          .sendFile(path.resolve(__dirname + "/../../ui/500.html"));
      }

      res.send(result);
    });
    conn.release();
  });
}

module.exports = {
  sendDetailsOfUsers: sendDetailsOfUsers,
};
