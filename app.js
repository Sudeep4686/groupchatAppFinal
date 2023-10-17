const express = require('express')
const dotenv = require("dotenv");
dotenv.config();
const path = require('path');
const bodyparser = require('body-parser');
const controller = require('./controllers/userC')
const userRouter = require('./routes/users');
const ChatsRouter = require('./routes/chat');
const groupRouter = require('./routes/groups');

const sequelize = require('./util/database');
const axios = require('axios');
const cors = require('cors');

const app = express();

const User = require('./models/user');
const chat = require('./models/chat');
const Usergroups = require('./models/usergroups');
const Groups = require('./models/groups');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false})); 
app.use(express.static('public'));
app.use(cors({origin:"*",methods:["GET","POST","PUT","DELETE"]}))

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signup.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use('/user', userRouter);
app.use('/message',ChatsRouter);
app.use('/groups',groupRouter);

User.hasMany(chat);
chat.belongsTo(User)

Groups.hasMany(chat);
chat.belongsTo(Groups);

User.hasMany(Usergroups);
Usergroups.belongsTo(User);

Groups.hasMany(Usergroups);
Usergroups.belongsTo(Groups);


sequelize.sync({force:false})
.then(()=>{
    console.log("details synced with database")
})
.catch((err)=>{
    console.log("details could not be synced with database",err.message)
})

app.listen(2200,()=>{
    console.log('Server is running on port 2200');
});