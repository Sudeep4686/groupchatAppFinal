const Chat = require('../models/chat');
const User = require('../models/user');

async function saveMessage(req,res){
    const {message} = req.body;

    try{
        const newMessage= await Chat.create({
            name:req.body.name,
            message:message,
            userId:req.user.id
        });

        res.status(201).json({success:true,message:"Message saved successfully",details:newMessage});
    }catch(error){
        console.error('Failed to save the chat message:',error);
        res.status(500).json({success:false,error:'Failed to save the chat message'});
    }
}

module.exports={saveMessage};