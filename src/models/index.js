const Sequelize = require("sequelize");
const User = require("./user");
const UpBitAccounts = require("./upbitAccounts");
const BihumAccounts = require("./bithumAccounts");
const VcAtmLoc = require("./vcAtmLoc");
const env = process.env.NODE_ENV || "";
const config = require("../../config/config")[env];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;

User.initiate(sequelize);
UpBitAccounts.initiate(sequelize);
BihumAccounts.initiate(sequelize);
VcAtmLoc.initiate(sequelize);

User.associate(db);

module.exports = db;
