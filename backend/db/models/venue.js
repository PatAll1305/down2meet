'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Venue.hasMany(models.Event, {
        foreignKey: 'venueId',
        onDelete: 'CASCADE'
      })
      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId'
      });
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Groups', key: 'id' }
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Street address is required'
        },
        notNull: {
          msg: 'Street address is required'
        }
      }
    },
    city: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'City is required'
        },
        notNull: {
          msg: 'City is required'
        }
      }
    },
    state: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'State is required'
        },
        notNull: {
          msg: 'State is required'
        }
      }
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        latitudeCheck(value) {
          if (value < -87 || value > 87) {
            throw new Error('Latitude is not valid');
          }
        }
      }
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        longitudeCheck(value) {
          if (value < -180 || value > 180) {
            throw new Error('Longitude is not valid');
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Venue',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', "updatedAt"]
      }
    }
  });
  return Venue;
};