const express=require('express');
const userAuth=require('../middlewares/auth');
const ConnectReq=require('../models/connectReq');
const mongoose=require('mongoose');
const User=require('../models/user');

const connectReqRouter=express.Router();

//for user sending a connection request
connectReqRouter.post('/request/send/:status/:userId',userAuth,async(req,res)=>{
    try{ 

        const status=req.params.status;

        if(!["interested","ignored"].includes(status)){
            throw new Error("Status should be either 'interested' or 'ignored' ");
        }

        const toUserId=new mongoose.Types.ObjectId(req.params.userId);
        const fromUserId=req.user._id;

         const isExisting=await ConnectReq.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        });
        
        if(isExisting){
            throw new Error("Request already exists");
        }

               //in User database does the toUser exists?
          const toUserExists=await User.findById(toUserId);
            if(!toUserExists){
            throw new Error("User not found");
            }
        
        const connectReqInstance=new ConnectReq({
            toUserId,
            fromUserId,
            status
        });
        
        await connectReqInstance.save();


        res.send(`${req.user.firstName} interested in connecting with ${toUserExists.firstName}`);

    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

//for user reviewing his received requests
connectReqRouter.post('/request/review/:status/:requestId',userAuth,async (req,res)=>{
    //check whether the status is valid or not
    //check whether the requestId is valid or not
    //now from db reqconnection collection, take that doc where _id is requestId,toUserId is loggedInuserId, status is interested
    //once you found that, update that db status with incomming status
    try{
        
        const {status,requestId}=req.params;
        const loggedInuser=req.user;
        if(!["accepted","rejected"].includes(status)){
            throw new Error("Status is not valid!");
        } 
        
        const connectionReq=await ConnectReq.findOne({
            _id:requestId,
            toUserId:loggedInuser._id,
            status:"interested"
        });

        if(!connectionReq){
            throw new Error("Request not found");
        }
        connectionReq.status=status;
        const data=await connectionReq.save();
        res.send({
            message:`Request updated successfully with ${status}`,
            data
        });
    }catch(err){
        res.status(400).send("Bad request: "+err.message);
    }    

})

module.exports=connectReqRouter;

