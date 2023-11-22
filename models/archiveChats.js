const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const ArchiveChat = sequelize.define("archivechat",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    message:Sequelize.STRING,
});

module.exports=ArchiveChat;