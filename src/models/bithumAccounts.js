const Sequelize = require("sequelize");

class BithumAccounts extends Sequelize.Model {
  static initiate(sequelize) {
    BithumAccounts.init(
      {
        bithum_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        currency: {
          type: Sequelize.STRING(10),
          allowNull: true,
        },
        balance: {
          type: Sequelize.DECIMAL(20, 8),
          allowNull: true,
        },
        locked: {
          type: Sequelize.DECIMAL(20, 8),
          allowNull: true,
        },
        avg_buy_price: {
          type: Sequelize.DECIMAL(20, 8),
          allowNull: true,
        },
        avg_buy_price_modified: {
          type: Sequelize.BOOLEAN,
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
        modelName: "BithumAccounts",
        tableName: "bithumAccounts",
        timestamps: true,
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
