const express = require("express");
const passport = require("passport");
const { isLoggedIn } = require("../middlewares");
const { logout } = require("../api/controllers/auth");
const router = express.Router();

// GET /auth/logout
router.get("/logout", isLoggedIn, logout);

// GET /auth/kakao
router.get("/kakao", passport.authenticate("kakao"));

// GET /auth/kakao/callback
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    console.log(req.session);
    console.log(req.user);
    // res.redirect("/");
    res.redirect("https://bitrics.vercel.app/assets");
  }
);

module.exports = router;
