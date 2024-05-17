'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Membership.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
      Membership.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  Membership.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Groups', key: 'id' }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Users', key: 'id' }
    },
    status: {
      type: DataTypes.ENUM({ values: ['pending', 'member', 'co-host', 'organizer'] }),
      allowNull: false,
      validate: {
        application(value) {
          const levels = ['pending', 'member', 'co-host', 'organizer'];

          if (!levels.includes(value)) {
            throw new Error('Invalid membership type');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};