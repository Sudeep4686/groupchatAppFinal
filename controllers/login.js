const bodyparser = require('body-parser');
const User = require('../models/user');

async function insertData(req,res){
    console.log(req.body, "Data Posting");
    if (!req.body.name || !req.body.email ||!req.body.mobile || !req.body.password){
        console.log("error");
        return res.status(400).send({
            message:"please fill all the details"
        })
    }
    const obj = {
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:req.body.password
    }
    try{
        const data = await User.create(obj)
        // console.log(data,"DATA OBJ");
        res.redirect('/');
        
    }catch(err){
        res.status(500).send(err);
        console.log("could not send the data");
    }

}

module.exports={insertData};