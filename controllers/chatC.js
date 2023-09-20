const Chat = require('../models/chat');
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
            },
        });
        console.log("Messageeee : ",message);
        return res.status(201).json({success:true, message:message , name:name});
    }catch(err){
        console.error("Failed to retrieve chat messages:",err.message)
        res.status(500).json({success:false,error:"Failed to retrieve the chat messages"});
    }
}

module.exports={saveMessage,getMessage};