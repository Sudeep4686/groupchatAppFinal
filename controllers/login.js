const bodyparser = require('body-parser');
const User = require('../models/user');
<<<<<<< HEAD
const bcrypt = require('bcrypt');
=======
>>>>>>> dc158b9e757f3958b93fe80d85d373af8d96c493

async function insertData(req,res){
    console.log(req.body, "Data Posting");
    if (!req.body.name || !req.body.email ||!req.body.mobile || !req.body.password){
        console.log("error");
        return res.status(400).send({
            message:"please fill all the details"
        })
    }
<<<<<<< HEAD
    // const obj = {
    //     name:req.body.name,
    //     email:req.body.email,
    //     mobile:req.body.mobile,
    //     password:req.body.password
    // }
    try{
        const {name,email,mobile,password } = req.body;
        console.log("recieved data: ",name ,email,mobile,password);
        const existingUser = await User.findOne({where : {email}});

        if(existingUser){
            console.log("User already Exists");
            return res.status(409).send({message : "User already exists" });
        }

        const saltrounds = 10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            const user = await User.create({name,email,mobile,password:hash});
            console.log("new user Created : ", user);
            return res.status(201).send({
            message:"User created successfully",
            alert : "User has been created"
        });
        })    
    }catch(err){
        console.log("error:", err);
        return res.status(500).send({message:"Internal server Error, check for the error"});
    }
}


async function login(req,res){
    const {email,password} = req.body;
    console.log("recieved login data: ",email);
    try{    
        const user = await User.findOne({where:{email}});

        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){
                    throw new Error("Something went wrong")
                }
                    if(result===true){
                        res.status(200).json({success : true, message:"User Logged in successfully",token: generateToken(user.id,user.ispremiumuser)});
                    }else{
                        return res.status(400).json({success:false,message:"Incorrect password"})
                    }
            })
        }else{
            return res.status(404).send({success:false,message:"User doesnot exist"})
        }

    }catch(error){
        console.log("error : ", error);
        return res.status(500).send({message:"Internal Server Error"});
    }
=======
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

>>>>>>> dc158b9e757f3958b93fe80d85d373af8d96c493
}

module.exports={insertData};