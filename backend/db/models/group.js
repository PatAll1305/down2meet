'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      });
      Group.hasMany(models.Venue, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      })
      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      })
      Group.belongsTo(models.User, {
        foreignKey: 'organizerId',
        hooks: true
      });
      Group.belongsToMany(models.User, {
        through: 'Members',
        foreignKey: 'memberId',
        otherKey: 'groupId',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        textLength(value) {
          if (value.length > 60) {
            throw new Error('Name must be 60 characters or less');
          }
        }
      }
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        textLength(value) {
          if (value.length < 50) {
            throw new Error('About must be 50 characters or more');
          }
        }
      }
    },
    type: {
      type: DataTypes.ENUM({ values: ['Online', 'In person'] }),
      allowNull: false,
      validate: {
        textLength(value) {
          const types = ['Online', 'In person']
          if (!types.includes(value)) {
            throw new Error(`Type must be 'Online' or 'In person'`);
          }
        }
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        textLength(value) {
          if (value !== true && value !== false) {
            throw new Error('Private must be a boolean');
          }
        }
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        textLength(value) {
          if (!value) {
            throw new Error('City is required');
          }
        }
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        textLength(value) {
          if (!value) {
            throw new Error('State is required');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};