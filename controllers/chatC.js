const Admin = require('../models/admin');
const Chat = require('../models/chat');
const User = require('../models/user');
const sequelize = require('../util/database');
const { Op } = require("sequelize");

async function saveMessage(req,res){
        const {message} = req.body;
        const groupId = req.query.groupId;
        console.log("GROUP message : ",message);
        try{    
        const userSendingMessage = await UserToGroup.findOne({
            where:{
                UserId:req.user.id,
            },
        });
        if (userSendingMessage!=null || userSendingMessage != undefined){
            const data = await Chat.create({
                chat:message,
                UserId:req.user.id,
                GroupChatId:groupId
            });
            console.log("checking group id in save message controller",groupId);
            res.status(200).json({ message:"successfully saved" });
        }else{
            res.json({
                message: "You are not part of the group in which you are trying to send message"
            });
        }
    }catch(error){
        console.error('Failed to save the chat message:',error);
        res.status(500).json({success:false,error:'Failed to save the chat message'});
    }
}

async function getMessage(req,res,next){
        const lastMsgId = req.query.lastMsgId;
        console.log('LAST MSG ID',lastMsgId);
        const groupId = req.query.gpId;
        console.log('GROUP ID',groupId);
        try{
        const chats = await Chat.findAll({
            where:{id:{[Op.gt]:lastMsgId},groupchatId:groupId},
            include:[
                {
                    model:User,
                    attributes:["name"],
                },
            ],
        });
        const adminRecord = await Admin.findAll({
            where:{
                userId:req.user.id,
                groupchatId:groupId,
            },
        });
        const isAdmin = adminRecord.length!==0;
        res.json({success:true, chats:chats , isAdmin:isAdmin});
    }catch(err){
        console.error("Failed to retrieve chat messages:",err.message)
        res.status(500).json({
            success:false,
        });
    }
}

module.exports={saveMessage,getMessage};