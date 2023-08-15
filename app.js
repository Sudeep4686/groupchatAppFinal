const express = require('express')
const path = require('path');
const bodyparser = require('body-parser');
const controller = require('./controllers/userC')
const sequelize = require('./util/database');
const axios = require('axios');
const cors = require('cors');

const User = require('./models/user');

const app = express();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));  

app.use(
    cors({
    origin:"http://127.0.0.1:2200",
})
)

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signup.html'));
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const userRouter = require('./routes/users');

app.use('/user', userRouter);


sequelize.sync({force:false})
.then(()=>{
    console.log("details synced with database")
})
.catch((err)=>{
    console.log("details could not be synced with database")
})

app.listen(2200);