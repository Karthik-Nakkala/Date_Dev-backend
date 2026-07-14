const express=require('express');
const validateSignupData=require('../helpers/validtion');
const bcrypt=require('bcrypt');
const User=require('../models/user');
const validator=require('validator');

const authRouter=express.Router();


//signup api
authRouter.post('/signup',async(req,res)=>{
    
   
    try{
        //All fields validation
        
        validateSignupData(req,res);
    
        const {firstName, lastName, emailId, password,age,gender,photoUrl,skills}=req.body;
       
        const passwordHash=await bcrypt.hash(password,10);

        const userInstance=new User(
            {firstName, lastName, emailId, password:passwordHash,age,gender,photoUrl,skills}
        );
        await userInstance.save();
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
});

//login api
authRouter.post('/login',async(req,res)=>{
    try{
        const {emailId,password}=req.body;

    if(!validator.isEmail(emailId)){
        throw new Error("Enter valid email address");
    }

    const user=await User.findOne({emailId:emailId});
    

    if(!user){
        throw new Error("Invalid Credentials");
    }

    

    const isValidUser=await user.validatePassword(password);

    if(isValidUser){
        //creating the jsonwebtoken
        const token=await user.getJWT();

        //sending the created token to client
        res.cookie("token",token,{expires:new Date(Date.now()+(7*3600000))} );
        res.send("Login successfull!");
    }
    else{
        throw new Error("Invalid Credentials");
    }
    }catch(err){
        res.send(err.message);
    }
});

//log out api
authRouter.post('/logout',(req,res)=>{
    try{
        res.cookie("token",null,{expires:new Date()});//new Date()==new Date(Date.now())
        res.send("Logout successfully");
    }catch(err){
        res.status(400).send(err.message);
    }
});

module.exports=authRouter;