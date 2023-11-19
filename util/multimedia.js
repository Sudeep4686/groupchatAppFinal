const AWS = require("aws-sdk");
exports.storeMultiMedia=(data,gpId,fileName)=>{
    const s3Bucket = new AWS.S3({
        accessKeyId:process.env.IAM_USER_KEY,
        secretAccessKey:process.env.IAM_USER_SECRET_ID,
    });
    const file = `chat-${gpId}/${fileName}`;
    const params = {
        Bucket : process.env.BUCKET_NAME,
        Key:file,
        Body:data,
        ACL:"public-read",
    };
    return new Promise((res,rej)=>{
        s3Bucket.upload(params,(err,response)=>{
        if(err){
            console.log("Something went wrong",err);
            rej(err);
        }else{
            res(response.Location);
        }
    });
});
};