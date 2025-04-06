const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Import sequelize instance from database config
const { sequelize } = require('../config/database');

// Define models
const User = require('./User')(sequelize, DataTypes);
const Topic = require('./Topic')(sequelize, DataTypes);
const Message = require('./Message')(sequelize, DataTypes);

// Set up associations
const models = {
  User,
  Topic,
  Message
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models
module.exports = {
  sequelize,
  ...models
}; 