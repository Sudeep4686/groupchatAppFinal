const Chat = require("../models/chat");
exports.addChat = async(gpId,message,userId)=>{
    await Chat.create({
        chat:message,
        userId:userId,
        GroupChatId:gpId,
    });
    return;
}