const express = require('express')
const path = require('path');
const bodyparser = require('body-parser');
const controller = require('./controllers/userC')
const userRouter = require('./routes/users');
const ChatsRouter = require('./routes/chat');

const sequelize = require('./util/database');
const axios = require('axios');
const cors = require('cors');

const User = require('./models/user');
const chat = require('./models/chat');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true})); 
app.use(express.static('public'));
app.use(cors({
    origin:"http://127.0.0.1:2200",
})
)

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signup.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.use('/user', userRouter);
app.use('/message',ChatsRouter);


sequelize.sync({force:false})
.then(()=>{
    console.log("details synced with database")
})
.catch((err)=>{
    console.log("details could not be synced with database")
})

app.listen(2200,()=>{
    console.log('Server is running on port 2200');
});