 const ConnectionReq=require('../models/connectReq');
 
 async function checkConnectionRequestExists(loginUserId, targetedUserId) {
    const connection = await ConnectionReq.findOne({
      $or: [
        { fromUserId: loginUserId, toUserId: targetedUserId },
        { fromUserId: targetedUserId, toUserId: loginUserId },
      ],
      status:'accepted'
    });
    return connection;
  }

  module.exports=checkConnectionRequestExists;