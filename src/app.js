const express=require("express");
const connectDb=require('./config/database');
const User=require('./models/user');
const validateSignupData=require('./helpers/validtion');
const bcrypt=require('bcrypt');
const validator=require('validator');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const userAuth=require('./middlewares/auth');

const app=express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup',async(req,res)=>{

   
    try{
        //All fields validation
        validateSignupData(req);
    
        const {firstName, lastName, emailId, password,age,gender,photoUrl,skills}=req.body;
       
        const passwordHash=await bcrypt.hash(password,10);

        const userInstance=new User(
            {firstName, lastName, emailId, password:passwordHash,age,gender,photoUrl,skills}
        );
        await userInstance.save();
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("Error: ",err.message);
    }
});

//login api
app.post('/login',async(req,res)=>{
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

})


//for getting profile details of currently login user
app.get('/profile',userAuth, async (req,res)=>{
   try{
        const user=req.user;
        if(!user){
            throw new Error("User not found");
        }
         res.send(user);
   }catch(err){
        res.status(400).send("Error: "+ err.message);
    }
});

//for user sending a connection request
app.post('/sendConnectionRequest',userAuth, (req,res)=>{
    res.send(req.user.firstName+" Sent connection request");
})







//First database should be connected and then only server should start listen for requests
connectDb().then(()=>{
    console.log("Database connected succesfully😅🥰🥰");
    app.listen(7777,()=>{
    console.log("Server strated serving😤😤😤😤");
});
}).catch((err)=>{
    console.error("Database connection failed😞😞😞😞");
})



