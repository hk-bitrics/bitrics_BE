const Sequelize = require("sequelize");
const User = require("./user");
const UpbitAccounts = require("./upbitAccounts");
const BithumbAccounts = require("./bithumbAccounts");
const VcAtmLoc = require("./vcAtmLoc");
const env = process.env.NODE_ENV || "development";
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
db.UpbitAccounts = UpbitAccounts;
db.BithumbAccounts = BithumbAccounts;
db.VcAtmLoc = VcAtmLoc;

User.initiate(sequelize);
UpbitAccounts.initiate(sequelize);
BithumbAccounts.initiate(sequelize);
VcAtmLoc.initiate(sequelize);

User.associate(db);
UpbitAccounts.associate(db);
BithumbAccounts.associate(db);

module.exports = db;
