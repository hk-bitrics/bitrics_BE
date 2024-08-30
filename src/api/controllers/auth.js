const passport = require("passport");
const User = require("../../models/user");

exports.logout = (req, res) => {
  req.logout(() => {
    res.status(200).json({ message: "Logout successful" }); // 200 OK
  });
};
