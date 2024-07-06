const { Sequelize } = require('sequelize');
const config = require('../config/config');


const sequelize = new Sequelize(config.development);

const User = require('./user')(sequelize, Sequelize.DataTypes);
const Organisation = require('./organisation')(sequelize, Sequelize.DataTypes);

User.belongsToMany(Organisation, { through: 'UserOrganisations' });
Organisation.belongsToMany(User, { through: 'UserOrganisations' });

module.exports = sequelize;
