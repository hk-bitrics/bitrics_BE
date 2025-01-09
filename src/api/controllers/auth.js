exports.authCheck = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      loggedIn: true,
      user: req.user,
    });
  }
  return res.json({ loggedIn: false });
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res
        .status(500)
        .json({ message: "Logout failed", error: err.message });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Session Destroy Error:", err);
        return res.status(500).json({ message: "Session destruction failed" });
      }

      res.clearCookie("connect.sid", { path: "/" });
      res.status(200).json({ message: "Logout successful" });
    });
  });
};
