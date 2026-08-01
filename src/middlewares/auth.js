const jwt=require('jsonwebtoken');
const User=require('../models/user');

const userAuth = async (req,res,next)=>{
    try{
        const {authToken}=req.cookies;
        console.log("Token=>",authToken);
    if(!authToken){
        return res.status(401).send("You are nott authorised");
    }
    
    const decodedToken=await jwt.verify(authToken,"Date_@_Dev30k");

    const {_id}=decodedToken;

    const user=await User.findById(_id);

    if(!user){
        throw new Error("user not found🤨");
    }

    

    req.user=user;


    next();
    }catch(err){
        res.status(400).send("Error: "+err.message);
    }
}

module.exports=userAuth;