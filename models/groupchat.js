const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Groupchat = sequelize.define("GroupChat",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    name:Sequelize.STRING,
});

module.exports = Groupchat;