const Sequelize = require("sequelize");

class VcAtmLoc extends Sequelize.Model {
  static initiate(sequelize) {
    VcAtmLoc.init(
      {
        atm_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        city: {
          type: Sequelize.STRING(20),
          allowNull: true,
          unique: false,
        },
        lat: {
          type: Sequelize.FLOAT,
          allowNull: true,
          unique: false,
        },
        lon: {
          type: Sequelize.FLOAT,
          allowNull: true,
          unique: false,
        },
        buy_sell: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          unique: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
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
