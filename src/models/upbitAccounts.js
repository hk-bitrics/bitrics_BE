const Sequelize = require("sequelize");

class UpbitAccounts extends Sequelize.Model {
  static initiate(sequelize) {
    UpbitAccounts.init(
      {
        upbit_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        currency: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        balance: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        locked: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        avg_buy_price: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        unit_currency: {
          type: Sequelize.STRING(15),
          allowNull: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "user_id",
          },
        },
      },
      {
        sequelize,
        modelName: "UpbitAccounts",
        tableName: "upbitAccounts",
        timestamps: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    UpbitAccounts.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

module.exports = UpbitAccounts;
