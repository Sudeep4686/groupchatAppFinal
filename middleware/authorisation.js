const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticate = async(req,res,next)=>{
    try{
        const token = req.header("Authorization");
        console.log("token in auth : ", token)
        if(!token){
            return res.status(401).json({message:"Unauhtorised:Token not provided"});
        }

        const secretKey = "secretkey";
        const decoded = jwt.verify(token,secretKey);
        const userId = decoded.userId;

        const user = await User.findByPk(userId);
        if(!user){
            return res.status(401).json({message:"Unauthorised:User not found"});
        }

        req.user={
            id:user.id,
            name:user.name
        };
        next();

    }catch(err){
        console.log("Error occured while authenticating the user;",err.message);
        return res.status(401).json({message:"Unauthorised"});
    }
};