const Admin = require("../models/admin");
const sequelize = require("../util/database");
async function makeAdmin(req,res,next){
    const t = await sequelize.transaction();
    const userId = req.query.userId;
    const groupId = req.query.gpId;
    try{
        await Admin.create(
            {
                userId:userId,
                GroupChatId:groupId,
            },
            {transaction: t }
        );
        await t.commit();
        res.json({
            success:true,
        });
    }catch(error){
        await t.rollback();
        console.log(error);
        res.status(500).json({
            success:false,
        });
    }
}

async function removeAdmin(req,res,next){
    const groupId = req.query.gpId;
    const userId = req.query.userId;
    console.log("groupid in removeadmin in admin controller",groupId);
    const t = await sequelize.transaction();
    try{
        const adminRecord = await Admin.findOne({
            where:{
                userId:userId,
                GroupChatId:groupId
            },
        });
        await adminRecord.destroy({transaction:t });
        await t.commit();
        res.json({
            success:true,
        });
    }catch(error){
        await t.rollback();
        console.log(error);
        res.status(500).json({
            success:false,
        });
    }
}

module.exports = {
    makeAdmin:makeAdmin,
    removeAdmin:removeAdmin,
}