const express=require('express');
const userAuth=require('../middlewares/auth');

const connectReqRouter=express.Router();

//for user sending a connection request
connectReqRouter.post('/sendConnectionRequest',userAuth, (req,res)=>{
    res.send(req.user.firstName+" Sent connection request");
})

module.exports=connectReqRouter;

