const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require("../models/user");

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://bitrics-hk.duckdns.org/auth/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const exUser = await User.findOne({
            where: {
              kakao_id: profile.id,
            },
          });
          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              nickname: profile.displayName,
              kakao_id: profile.id,
              email: profile._json.kakao_account.email,
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
