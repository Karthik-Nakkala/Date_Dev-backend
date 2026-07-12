const express=require('express');
const userAuth=require('../middlewares/auth');
const ConnectReq=require('../models/connectReq');
const mongoose=require('mongoose');
const User=require('../models/user');

const connectReqRouter=express.Router();

//for user sending a connection request
connectReqRouter.post('/request/send/:status/:userId',userAuth,async(req,res)=>{
    try{ 
        let toUserId=req.params.userId;
        const toUserExists=await User.findById(toUserId);
        if(!toUserExists){
            throw new Error("User not found");
        }
        const status=req.params.status;
        if(!["interested","ignored"].includes(status)){
            throw new Error("Status should be either 'interested' or 'ignored' ");
        }
        toUserId=new mongoose.Types.ObjectId(toUserId);
        const fromUserId=req.user._id;
        if(toUserId.equals(fromUserId)){
            throw new Error("Invalid request! self-requests are not allowed");
        }
        
        const isExisting=await ConnectReq.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        });
        if(isExisting){
            throw new Error("Request already exists");
        }
        const connectReqInstance=new ConnectReq({
            toUserId,
            fromUserId,
            status
        });
        await connectReqInstance.save();
        res.send("Sent request successfully");
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

module.exports=connectReqRouter;

