const Chat = require('../models/chat');
const User = require('../models/user');

async function saveMessage(req,res){
    const {message} = req.body;

    try{
        const newMessage= await Chat.create({
            name:req.user.name,
            message:message,
            userId:req.user.id
        });

        res.status(201).json({success:true,message:"Message saved successfully",details:newMessage});
    }catch(error){
        console.error('Failed to save the chat message:',error);
        res.status(500).json({success:false,error:'Failed to save the chat message'});
    }
}

async function getMessage(req,res,next){
    try{
        console.log("Getting User:",req.user)
        const id = req.user.id;
        const name = req.user.name;
        console.log("id in getMessage",id);
        console.log("name in getMessage:", name);

        const message = await Chat.findAll({where:{userId:id}});

        return res.status(201).json({success:true, message:message , name:name});
    }catch(err){
        console.error("Failed to retrieve chat messages:",err.message)
        res.status(500).json({success:false,error:"Failed to retrieve the chat messages"});
    }
}

module.exports={saveMessage,getMessage};