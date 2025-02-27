const express = require("express");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const { authCheck, logout } = require("../api/controllers/auth");
const router = express.Router();

// GET /auth/authCheck
router.get("/check", authCheck);

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
    // res.redirect("https://bitrics.vercel.app/asset");
    res.status(200).json({
      message: "로그인 성공",
      user: req.user,
    });
  }
);

module.exports = router;
