const Chat = require('../models/chat');
const Groups = require('../models/groups');
const UserGroup = require('../models/usergroups');
const User = require('../models/user');

const { Op } = require("sequelize");

async function saveMessage(req,res){
    const {message} = req.body;

    try{
        const id = req.user.id;
        const name = await User.findOne({where:{id}});
        console.log("NAME :",name);
        const Name = name.name;
        const newMessage = await req.user.createChat({
            message:message,
            name:Name
        });

        return res.status(201).json({
            success:true,
            // message:"Message saved successfully",
            // details:{newMessage,name},
            message:newMessage,
            name:Name
        });
    }catch(error){
        console.error('Failed to save the chat message:',error);
        res.status(500).json({success:false,error:'Failed to save the chat message'});
    }
}

async function getMessage(req,res,next){
    try{
        // console.log("Getting User:",req.user)
        // const id = req.user.id;
        // const name = req.user.name;
        // console.log("id in getMessage",id);
        // console.log("name in getMessage:", name);

        // const message = await Chat.findAll({where:{userId:id}});

        const id = req.user.id;
        const name = req.user.name;
        const lastmsg = req.query.lastmsg;

        console.log("id in getMessage:",id);
        console.log("name in getMessage:",name);
        console.log("lastmsgg: ",lastmsg);
        
        const message = await Chat.findAll({
            where:{
                id:{
                    [Op.gt]:lastmsg,
                },
                groupId:null,
            },
        });
        console.log("Messageeee : ",message);
        return res.status(201).json({success:true, message:message , name:name});
    }catch(err){
        console.error("Failed to retrieve chat messages:",err.message)
        res.status(500).json({success:false,error:"Failed to retrieve the chat messages"});
    }
}

async function createGroup(req,res){
    try{
        const {name} = req.body;
        console.log("checking the group name in creategroup chat controller : ",req.body);
        const group = await Groups.create({groupName:name});
        const groupId = group.id;
        console.log("checking the group id in creategroup chat controller : ",groupId);

        await UserGroup.create({
            groupName:name,
            groupId:group.id,
            userId:req.user.id,
            userName:req.user.name
        })

        res.status(200).json({groupId:group.id,message:"Group created Successfully"});
    }catch(error){
        console.log("Error creating the group",error.message);
        res.status(500).json({error:"Failed to create the group"})
    }
}

async function getGroupList(req,res){
    try{
        console.log("EnTERED THIS FUNCTION GETGROUPSLIST");
        const groups = await UserGroup.findAll({where:{userId:req.user.id}});
        console.log("checking the group names in getgrouplist in chstcontroller : ",groups);
        res.status(200).json(groups);
    }catch(error){
        console.log("Error gettinig the group list : ",error.message);
        res.status(500).json({error:"Failed to get the group list"});
    }
}

module.exports={saveMessage,getMessage,createGroup,getGroupList};