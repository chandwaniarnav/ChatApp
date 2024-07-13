const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const User = require('./user');
const message = sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: User, 
      key: 'id',   
    },
  },
  message: {
    type: DataTypes.STRING,
  },
  is_image: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),  
  },
}, {
  tableName: 'messages', 
  timestamps: false, 
});
message.belongsTo(User, { foreignKey: 'user_id' });
module.exports = message;