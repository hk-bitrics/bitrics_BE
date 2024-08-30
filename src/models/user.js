const Sequelize = require("sequelize");

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nickname: {
          type: Sequelize.STRING(15),
        },
        email: {
          type: Sequelize.STRING(255),
          unique: true,
        },
        kakao_id: {
          type: Sequelize.STRING(30),
          unique: true,
        },
      },
      {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    User.hasMany(db.UpbitAccounts, {
      foreignKey: "user_id",
      as: "upbitAccounts",
    });
    User.hasMany(db.BithumbAccounts, {
      foreignKey: "user_id",
      as: "bithumbAccounts",
    });
  }
}

module.exports = User;
