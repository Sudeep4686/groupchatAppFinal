const express = require('express')
const dotenv = require("dotenv");
dotenv.config();
const path = require('path');
const bodyparser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const socketio = require("socket.io");
const http = require("http");
var CronJob = require("cron").CronJob;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false})); 
app.use(cors({origin:"*",methods:["GET","POST","PUT","DELETE"]}))

const sequelize = require('./util/database');
const {getuserdetails}=require("./util/user-base");
const { addChat } = require("./util/chat-base");
const {storeMultiMedia} = require("./util/multimedia");
const {moveChatToArchive} = require("./util/cron");

const userRoutes = require('./routes/users');
const ChatsRoutes = require('./routes/chat');
const GroupRoutes = require('./routes/newgroup');
const groupRoute = require('./routes/groups');
const adminRoutes = require('./routes/admin');

const User = require('./models/user');
const Chat = require('./models/chat');
const GroupChat = require('./models/groupchat');
const Admin = require('./models/admin');
const ArchiveChat = require("./models/archiveChats");

app.use('/user', userRoutes);
app.use('/chat',ChatsRoutes);
app.use('/message',ChatsRoutes);
app.use('/newgroup',GroupRoutes);
app.use("/groups",groupRoute);
app.use("/admin",adminRoutes);

app.use(express.static(path.join(__dirname, "public")));

User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(ArchiveChat);
ArchiveChat.belongsTo(User);

GroupChat.hasMany(Chat);
Chat.belongsTo(GroupChat);

GroupChat.hasMany(ArchiveChat);
ArchiveChat.belongsTo(GroupChat);

User.belongsToMany(GroupChat,{through:"usergroups" });
GroupChat.belongsToMany(User,{through:"usergroups"});

GroupChat.hasMany(Admin);
User.hasMany(Admin);

//CRON JOB
const job = new CronJob(
    "0 0 * * *",
    moveChatToArchive,
    null,
    true,
    "Asia/Kolkata"
);
job.start();

io.on("connection",(socket)=>{
    socket.on("joinRoom",async({userId,gpId,userName})=>{
        if(gpId){
            console.log(`${userName} joined ${gpId}`);
            socket.join(gpId);
            socket.emit("message",{
                userId:-1,
                message:"Welcome to chat app",
                gpId:-1,
                name:userName,
                userName:userName,
            });
            socket.to(gpId).emit("message",{
                userId:-1,
                userName:userName,
                message:`${userName} has connected to the chat`,
                gpId:-1,
            });
        }
    });

    socket.on("chatMessage",async (data)=>{
        console.log("data",data)
        if(data.gpId){
            console.log(data.gpId,"gpIDDD in sockets in app.js");
            const [formattedData] = await Promise.all([
                getuserdetails(data.userId,data.message),
                addChat(data.gpId,data.message,data.userId),
            ]);
            console.log(formattedData,"formatteddd data");
            socket.to(data.gpId).emit("message",formattedData);
        }
    });
    socket.on("upload",async(fileData,cb)=>{
        console.log("file",fileData);
        const fileUrl = await storeMultiMedia(
            fileData.fileBuffer,
            fileData.gpId,
            fileData.fileName
        );
        console.log(fileUrl);
        addChat(fileData.gpId,fileUrl,fileData.userId);
        cb(fileUrl);
    });
});

sequelize.sync({force:false})
.then(()=>{
    console.log("details synced with database");
})
.catch((err)=>{
    console.log("details could not be synced with database",err.message)
});

server.listen(2200,()=>{
    console.log('Server is running on port 2200');
});