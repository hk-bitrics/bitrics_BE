const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const passport = require("passport");
const cors = require("cors");
const swaggerSetup = require("./swagger");

dotenv.config();
const authRouter = require("../src/routes/auth");
const marketRouter = require("../src/routes/market");
const mapRouter = require("../src/routes/map");
const assetRouter = require("../src/routes/asset");
const newsRouter = require("../src/routes/news");

const { sequelize } = require("./models");
const passportConfig = require("./passport");

const app = express();
passportConfig();
app.set("port", process.env.PORT || 3000);
swaggerSetup(app);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error("데이터베이스 연결 실패: ", err);
  });

app.use(
  cors({
    // origin: "https://bitrics.vercel.app",
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/", marketRouter);
app.use("/", mapRouter);
app.use("/", assetRouter);
app.use("/", newsRouter);

app.use((req, res, next) => {
  console.log(req, res);
  res.status(404).json({
    message: `${req.method} ${req.url} 라우터 없습니다.`,
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV !== "production" ? err.message : {},
  });
});

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")} 번 포트에서 대기 중`);
});
