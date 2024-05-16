'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Group, {
        through: 'Memberships',
        otherKey: 'userId',
        foreignKey: 'groupId',
        onDelete: "CASCADE"
      })
      User.belongsToMany(models.Event, {
        through: 'Attendances',
        foreignKey: 'eventId',
        otherKey: 'userId',
        onDelete: 'CASCADE'
      });
      User.hasMany(models.Group, {
        foreignKey: 'organizerId'
      });
    }
  };

  User.init(
    {
      firstName: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [3, 50]
        }
      },
      lastName: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [3, 50]
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  }
  );
  return User;
};