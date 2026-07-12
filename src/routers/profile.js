const express=require('express');
const userAuth=require('../middlewares/auth');
const User=require('../models/user');
const validateUpdateData = require('../helpers/validateUpdateData');
const validator=require('validator');
const bcrypt=require('bcrypt');

const profileRouter=express.Router();

//for getting profile details of currently login user
profileRouter.get('/profile/view',userAuth, (req,res)=>{
   try{
        const user=req.user;
        if(!user){
            throw new Error("User not found");
        }
        const {firstName,lastName,emailId,age,gender,photoUrl,skills}=user;
         res.json({
            firstName,
            lastName,
            emailId,
            age,
            gender,
            photoUrl,
            skills
         });
   }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});

profileRouter.patch('/profile/edit',userAuth,async (req,res)=>{

    try{

        if(!validateUpdateData(req)){
            throw new Error("Invalid fields updatation");
        }
        const updates={};
        Object.keys(req.body).forEach(key=>updates[key]=req.body[key]);
        const dataUpdating=await User.findByIdAndUpdate(req.user._id,updates,{
            new:true,
            runValidators:true,
        });
        res.send("updation successfull");
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
    
});


//change password api
profileRouter.patch('/profile/password',userAuth, async (req,res)=>{

    try{
        const user=req.user;
        const verifyOldPassword=await user.validatePassword(req.body.password);
        if(!verifyOldPassword){
            
            throw new Error("First, please enter your old password correctly");
        }
        
        const newPassword=req.body.newPassword;
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Please make sure your new password should be stronger");      
        }
        const hashedPassword=await bcrypt.hash(newPassword,10);
        const newUserDoc=await User.findByIdAndUpdate(
            user._id,
            {password:hashedPassword},
            {returnDocument: 'after',runValidators:true}
            );
    
        res.json({
             message:"Password changed successfully",
         });
    }catch(err){
        res.send("Error: "+err.message);
    }
});


module.exports=profileRouter;