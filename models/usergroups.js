// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const usergroups = sequelize.define('usergroups',{
//     id:{
//         type:Sequelize.INTEGER,
//         primaryKey:true,
//         autoIncrement:true
//     },
//     groupName:{
//         type:Sequelize.STRING
//     },
//     userName:{
//         type:Sequelize.STRING
//     },
//     UserId:{
//         type:Sequelize.INTEGER
//     },
//     GroupId:{
//         type:Sequelize.INTEGER
//     },
//     isAdmin:{
//         type:Sequelize.BOOLEAN,
//         allowNull:true
//     }
// });

// module.exports = usergroups;


const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const usergroups = sequelize.define("usergroups", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  groupName:{
    type:Sequelize.STRING,
    allowNull:false
  },
  userName:{
    type:Sequelize.STRING,
    allowNull:false

  },
  userId:{
    type: Sequelize.INTEGER,
    allowNull: false,

  },
  groupId:{
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  }
});
module.exports=usergroups;