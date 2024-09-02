const Sequelize = require("sequelize");

class VcAtmLoc extends Sequelize.Model {
  static initiate(sequelize) {
    VcAtmLoc.init(
      {
        city: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING(20),
          allowNull: true,
        },
        lat: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        lon: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        buy_sell: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        modelName: "VcAtmLoc",
        tableName: "vcAtmLoc",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {}
}

module.exports = VcAtmLoc;
