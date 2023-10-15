const Groups = require('../models/groups');
const User = require('../models/user');
const UserGr = require('../models/usergroups');
const Chat = require('../models/chat');
const usergroups = require('../models/usergroups');

async function getUserList(req,res){
    try{
        const users = await User.findAll();
        res.status(200).json(users);
    }catch(err){
        console.log("Could not fetch users list");
        res.status(400).send({error:"Failed to get user list"});
    }
}

async function AddToGroup(req,res){
    try{
        const groupId = req.body.groupId;
        const userId = req.body.userId;
        const groupName = req.body.groupName;
        const userName = req.body.userName;
        console.log("Printing Body here : ",req.body);

        const createdgroupName = await Groups.create({
            groupName:groupName,
        })

        const existingUser = await UserGr.findOne({where:{groupId:groupId,userId:userId}});

        if(existingUser){
            return res.status(400).json({error:'User is already in the group'});
        }

        const group = await UserGr.create({
                groupId:groupId,
                userId:userId,
                groupName:groupName,
                userName:userName
        });
        console.log(group,"Checking for group name in details");
        res.status(200).json({groupname:createdgroupName,message:"User added to group succesfully"});
    }catch(err){
        console.log("Error adding user to the group:",err);
        res.status(500).json({error:"Failed to add user to group"});     
    }
}

async function saveMessage(req,res){
    const {message, groupId} = req.body;

    try{
        const newMessage = await Chat.create({
            name:req.user.name,
            message:message,
            urlfile:null,
            userId:req.user.id,
            groupId:groupId
        });

        console.log("Checking new message details here : ",newMessage);
        res.status(201).json({success:true,newMessage,message:"chst saved successfully"});
    }catch(error){
        console.log("Error while saving the message:",error);
        res.status(500).json({success:false,error:"Failed to save the message"});
    }
}

async function getMessages(req,res){
    const groupId = req.params.groupId;
    console.log("Checking to find the groupId here : ",groupId);
    try{
        const messages = await Chat.findAll({
            where:{groupId:groupId}
        });
        res.status(200).json({success:true,messages});
    }catch(error){
        console.log("Error getting messages in the group");
        res.status(500).json({success:false,error:"Failed to get messages in the group"})
    }
}

const getMembers = async (req,res,next)=>{
    try{
        const groupId = req.params.groupId;
        const members = await UserGr.findAll({
            where:{GroupId:groupId},
        });
        return res.status(200).json(members);
    }catch(error){
        console.log("Failed to retrieve the group members : ",error);
        res.status(500).json({success:false,error:"Failed to retrieve the group members "});
    }
}

async function removeUser(req,res){
    try{
        const userId = req.body.userId;
        const groupId = req.params.groupId;
        console.log("checking the groupId,userId : ",userId,groupId);

        const remove = await UserGr.destroy({
            where:{GroupId:groupId,UserId:userId},
        });

    

        if (remove===0){
            return res.status(404).json({message:"The User was not found in the group."});
        }
        res.json({message:'The user has been deleted.'});
    }catch(error){
        console.log("Error while removing the user:",error.message);
        res.status(500).json({message:"An error occured while removing the user."});
    }
}

// const getAdmin = async (req,res,next)=>{
//     try{
//         const userId = req.user.id;
//         const groupId = req.params.groupId;
//         const group = await usergroups.findAll({
//             where:{GroupId:groupId,UserId:userId},
//         });
//         console.log("GROUP LENGTH:",group.length);
//         const admin = group.length>0?group[0].isAdmin:null;                    
//         console.log("Printing the admin value here:",admin);
//         if (admin===true){
//             const isAdmin=1;
//             res.json(isAdmin);
//         }else{
//             res.send("The user is not an admin of this group.");
//         }
//     }catch(err){
//         console.log("Error fecthing the group details",err.message);
//         res.status(500).send("Error fetching group detais")
//     }
// }

// const makeAdmin = async(req,res,next)=>{
//     try{
//         const userId = req.body.userId;
//         const groupId = req.params.groupId;
//         console.log("userId,groupId checking",userId,groupId);

//         const admin = await usergroups.update(
//             {isAdmin:true},
//             {where:{GroupId:groupId,UserId:userId}});
//         res.json({admin,message:"Congrats!The user is admin now."})
//     }catch(err){
//         console.log(err.message);
//         res.status(500).json({error:"Internal Server Error"})
//     }
// }

const getAdmin = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const groupId = req.params.groupId;
      const group = await Groups.findAll({
        where: { GroupId: groupId, UserId: userId },
      });
      const admin = group.length > 0 ? group[0].isAdmin : null;
      console.log(admin, "printing the admin value");
      if (admin == true) {
        const isAdmin = 1;
        res.json(isAdmin);
      } else {
        res.send("The user is not an admin of this group.");
      }
    } catch (error) {
      console.log("Error fetching group details:", error);
      res.status(500).send("Error fetching group details.");
    }
  };
  const makeAdmin=async(req,res,next)=>{
    try{
      const userId = req.body.userId;
      const groupId = req.params.groupId;
  
      console.log(userId, groupId, 'printing user and group id');
  
      const admin = await Groups.update(
        { isAdmin: true },
        { where: { GroupId: groupId, UserId: userId } }
      );
  
      res.json({
        admin,
        message: 'Congratulations! The user is now the admin.',
      });
  
    }catch(error){
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  
    }
  }

module.exports={getUserList,AddToGroup,saveMessage,getMessages,getMembers,removeUser,getAdmin,makeAdmin};