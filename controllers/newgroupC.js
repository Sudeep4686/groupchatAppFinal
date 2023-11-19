const GroupChat = require("../models/groupchat");
const User = require("../models/user");
const sequelize = require("../util/database");
const { Op } = require('sequelize');

async function createNewGroup(req,res,next){
    const {groupName} = req.body;
    console.log("checking the group name in creategroup chat controller : ",req.body);
    try{
    const groupChat = await GroupChat.create({
        name:groupName,
    },
);
await Promise.all([
    groupChat.addUser(req.user.id),
    groupChat.createAdmin(
        {
            userId:req.user.id,
        },
    ),
]);
res.status(201).json({
    group:groupChat,
});
}catch(error){
    console.log("Error entering the group name",error.message);
    res.status(500).json({error:"Internal Server Error"})
}
}

async function getUsers(req,res,next){
    try{
        const users = await User.findAll({
            attributes:["id","name","email","mobile"],
            where: {
                id: {
                  [Op.ne]: req.user.id
                }
            }
        });
        res.json({
            users:users,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
        });
    }
};

async function addUserToGroup(req,res,next){
    const t = await sequelize.transaction();
    const userId = req.query.userId;
    const groupId = req.query.gpId;
    try{
        const group = await GroupChat.findByPk(groupId);
        await group.addUser(userId,{transaction:t});
        await t.commit();
        res.status(200).json({
            success:true,
        });
    }catch(error){
        await t.rollback();
        console.log(error.message);
        res.status(500).json({
            success:false,
        });
    }
};

async function deleteUserFromGroup(req,res,next){
    const t = await sequelize.transaction();
    const userId = req.query.userId;
    const groupId = req.query.gpId;
    try{
        const group = await GroupChat.findByPk(groupId);
        await group.removeUser(userId,{transaction:t });
        await t.commit();
        res.status(200).json({
            success:true,
        });
    }catch(error){
        await t.rollback();
        console.log(error);
        res.status(500).json({
            success:false
        });
    }
}


async function postUpdateGroup(req,res,next){
    const {groupName} = req.body;
    const groupId = req.query.groupId;
    const t = await sequelize.transaction();    
    try{
        await GroupChat.update({
            name:groupName,
        },
        {where:{id:groupId}},
        {transaction:t});
        await t.commit();
        res.json({
            success:true,
        });
    }catch(error){
        await t.rollback();
        console.log(error);
        res.status(500).json({
            success:false,
        });
    }
}

module.exports = {
    createNewGroup : createNewGroup,
    getUsers:getUsers,
    addUserToGroup: addUserToGroup,
    deleteUserFromGroup : deleteUserFromGroup,  
    postUpdateGroup : postUpdateGroup,
}