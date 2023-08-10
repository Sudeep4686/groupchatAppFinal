const express = require('express')
const path = require('path');
const bodyparser = require('body-parser');
const controller = require('./controllers/login')
const sequelize = require('./util/database');
const axios = require('axios');

const User = require('./models/user');

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signup.html'));
})

app.post('/submit-form',controller.insertData);

sequelize.sync({force:false})
.then(()=>{
    console.log("details synced with database")
})
.catch((err)=>{
    console.log("details could not be synced with database")
})

app.listen(2200);