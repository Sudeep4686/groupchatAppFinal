// const Groups = require('../models/groups');
const Chat = require('../models/chat');
const User = require('../models/user');
const GroupChat = require("../models/groupchat");
const Admin = require("../models/admin");
const Sequelize = require("sequelize");
const {Op} = require("sequelize");

let members = [];
exports.getGroups = async(req,res,next)=>{
    try{
        const groups = await GroupChat.findAll({
            attributes:["id","name"],
            include:[
                {
                    model:User,
                    attributes:[],
                    where:{id:req.user.id },
                },
            ],
        });
        console.log("Groupsss",groups);
        res.json({
            groups:groups,
        });
    }catch(error){
        console.log(error, "Error while getting groups in controllers");
        res.status(500).json({
            success:false,
        });
    }
};

// exports.getMembers = async(req,res,next)=>{
//     const gpId = req.query.gpId;
//     console.log("GPID",gpId);
//     try{
//         //Find all admin members
//         const groupAdminMembers = await GroupChat.findAll({
//             where:{ id : gpId},
//             attributes:[],
//             include:[
//                 {
//                     model:User,
//                     attributes:["id","name"],
//                     include:[
//                         {
//                             model:Admin,
//                             where:{ groupChatId:gpId},
//                         },
//                     ],
//                 },
//             ],
//         });
//         console.log("Group Admin Members : ",groupAdminMembers);
//         const adminUserIds = groupAdminMembers.map((user)=>{
//             return user.id;
//         });
//         // const adminUserIds = groupAdminMembers.users ? groupAdminMembers.users.map((user) => user.id) : [];

//         console.log(adminUserIds,"Admin User Ids:");
//         // find all other members
//         const groupOtherMembers = await GroupChat.findOne({
//             where:{ id : gpId },
//             attributes:[],
//             include:[
//                 {
//                     model:User,
//                     attributes:["id","name"],
//                     where:{
//                         id:{ [Op.notIn]:adminUserIds },
//                     },
//                 },
//             ],
//         });
//         const adminmembers = groupAdminMembers.map((user)=>{
//             return{
//                 id:user.id,
//                 name:user.name,
//                 isAdmin : true,
//             };
//         });
//         let othermembers;
//         const otherMemberIds = [];
//         if (groupOtherMembers){
//             othermembers = groupOtherMembers.users.map((user)=>{
//                 otherMemberIds.push(user.id);
//                 return {
//                     id : user.id,
//                     name: user.name,
//                     isAdmin : false,
//                 };
//             });
//         } else {
//             othermembers = [];
//         }
//         members = [...adminUserIds, ...otherMemberIds];
//         res.json({
//             members:[...adminmembers, ...othermembers],
//             success:true,
//         });
//     }catch(error){
//         console.log(error);
//         res.status(500).json({
//             success:false,
//         });
//     }
// };

exports.getMembers = async (req, res, next) => {
    const gpId = req.query.gpId;
    try {
      // find all the admin members
      const groupAdminMembers = await GroupChat.findOne({
        where: { id: gpId },
        attributes: [],
        include: [
          {
            model: User,
            attributes: ["id", "name"],
            include: [
              {
                model: Admin,
                where: { GroupchatId: gpId },
              },
            ],
          },
        ],
      });
      console.log("Group Admin Members : ",groupAdminMembers);
      const adminUserIds = groupAdminMembers.users.map((user) => {
        return user.id;
      });
      console.log(adminUserIds);
      // find all the other members
      const groupOtherMembers = await GroupChat.findOne({
        where: { id: gpId },
        attributes: [],
        include: [
          {
            model: User,
            attributes: ["id", "name"],
            where: {
              id: { [Op.notIn]: adminUserIds },
            },
          },
        ],
      });
      const adminmembers = groupAdminMembers.users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          isAdmin: true,
        };
      });
      let othermembers;
      const otherMembersIds = [];
      if (groupOtherMembers) {
        othermembers = groupOtherMembers.users.map((user) => {
          otherMembersIds.push(user.id);
          return {
            id: user.id,
            name: user.name,
            isAdmin: false,
          };
        });
      } else {
        othermembers = [];
      }
      members = [...adminUserIds, ...otherMembersIds];
      res.json({
        members: [...adminmembers, ...othermembers],
        success: true,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
      });
    }
};
  

exports.getNonMembers = async(req,res,next)=>{
    const groupId = req.query.groupId;
    console.log("NonMembers of the group : ",members);
    try{
        const users = await User.findAll({
            where:{ id : {[Op.notIn]:members } },
            attributes:["id",[Sequelize.col("name"),"name"]],
        });
        console.log(users);
        res.json({
            users:users,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
        });
    }
}
