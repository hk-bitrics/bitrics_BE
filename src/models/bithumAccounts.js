const Sequelize = require("sequelize");

class BithumAccounts extends Sequelize.Model {
  static initiate(sequelize) {
    BithumAccounts.init(
      {
        bithum_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        currency: {
          type: Sequelize.STRING(10),
          allowNull: true,
          unique: true,
        },
        balance: {
          type: Sequelize.DECIMAL(20, 8),
          allowNull: true,
          unique: true,
        },
        locked: {
          type: Sequelize.DECIMAL(20, 8),
          allowNull: true,
          unique: true,
        },
        avg_buy_price: {
          type: Sequelize.DECIMAL(20, 8),
          allowNull: true,
          unique: true,
        },
        avg_buy_price_modified: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          unique: true,
        },
        unit_currency: {
          type: Sequelize.STRING(15),
          allowNull: true,
          unique: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "User",
            key: "user_id",
          },
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "UpbitAccounts",
        tableName: "upbitAccounts",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    BithumAccounts.belongsTo(db.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

module.exports = BithumAccounts;
