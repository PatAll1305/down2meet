'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE'
      });
      Event.belongsTo(models.Group, {
        foreignKey: 'groupId',
        onDelete: 'SET NULL'
      });
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId',
        onDelete: 'SET NULL'
      });
      Event.belongsToMany(models.User, {
        through: 'Attendances',
        foreignKey: 'eventId',
        otherKey: 'userId',
        onDelete: 'CASCADE'
      });
    }
  }
  Event.init({
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        typeView(value) {
          if (this.type === 'In person' && !value) {
            throw new Error('Not a valid value. Need venue for in person event');
          }
        }
      }
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        lenCheck(value) {
          if (value.length < 5) {
            throw new Error('Name must be at least 5 characters');
          }
        }
      }
    },
    type: {
      type: DataTypes.ENUM({ values: ['Online', 'In person'] }),
      allowNull: false,
      validate: {
        typeCheck(value) {
          let types = ['Online', 'In person']
          if (!types.includes(value)) {
            throw new Error('Type must be Online or In person');
          }
        }
      }
    },
    capacity: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          value: true,
          msg: 'Capacity must be an integer'
        }
      }
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        priceValidate(value) {
          if (value < 0.0) {
            throw new Error('Price is invalid');
          }
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description is required'
        }
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        checkCurrent(value) {
          let expectedDate = new Date(value);
          let curDate = new Date();
          if (expectedDate < curDate) {
            throw new Error("Start date must be in the future");
          }
        }
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        checkCurrent(value) {
          let expDate = new Date(value);
          let starDate = new Date(this.startDate);
          if (expDate < starDate) {
            throw new Error("End date is less than start date");
          }
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', "updatedAt"]
      }
    }
  });
  return Event;
};