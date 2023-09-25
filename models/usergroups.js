const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const usergroups = sequelize.define('usergroups',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    groupName:{
        type:Sequelize.STRING
    },
    userName:{
        type:Sequelize.STRING
    }
});

module.exports = usergroups;
