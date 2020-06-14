function validateIfUserIsLoggedIn(req, res) {
  try {
    if (req.cookies.userName) {
    } else {
      res.redirect("http://localhost:5000/login");
    }
  } catch (error) {
    res.redirect("http://localhost:5000/login");
  }
}

module.exports = {
  validateUser: validateIfUserIsLoggedIn,
};
