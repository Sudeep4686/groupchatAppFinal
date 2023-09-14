const {DataTypes} = require('sequelize');
const sequelize = require('../util/database');

const Chat = sequelize.define('chats',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement : true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false,
    }
});
module.exports=Chat;