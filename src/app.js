const express=require("express");
const connectDb=require('./config/database');
const User=require('./models/user');
const validateSignupData=require('./helpers/validtion');
const bcrypt=require('bcrypt');
const validator=require('validator');

const app=express();

app.use(express.json());

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

    const hashPassword=await User.findOne({emailId:emailId}).select('password').lean().exec();

    if(!hashPassword){
        throw new Error("Invalid Credentials");
    }

    const isValidUser=await bcrypt.compare(password,hashPassword.password);

    if(isValidUser){
        res.send("Login successfull!");
    }
    else{
        throw new Error("Invalid Credentials");
    }
    }catch(err){
        res.send(err.message);
    }

})


//getting user by emailId
app.get('/user',async(req,res)=>{
    try{
        const user=await User.findOne({emailId:req.body.emailId});
        if(!user){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send("something went wrong");
    }

});



//Feed Api -- For getting all users

app.get('/feed',async (req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }catch(err){
        res.send("Something went wrong!");
    }
});

//get user by ID
app.get('/user/:id',async(req,res)=>{
    const id=req.params.id;
    try{
        const user=await User.findById(id);
        if(!user){
            res.status(404).send("User not found");
        }
        else{
            res.send(user);
        }
    }catch(err){
        res.status(400).send("Something went wrong");
    }
    
});


//find doc by email id and add new filed into it which is not defined in schema
// app.patch('/user/updateByEmail',async(req,res)=>{
//     const email=req.body.email;
//     const updatedDoc=await User.findOneAndUpdate({emailId:email},{runs:17266},{strict:false,new:true});
//     res.send(updatedDoc);
// });

//update onlt the lastnme field with the help of id
app.patch('/user/:id',async (req,res)=>{
    const id=req.params.id;
    try{
        const INCLUDED_UPDATED_FIELDS=["age","gender","photoUrl","skills"];

        const isUpdatesAllowed=Object.keys(req.body).every(k=>INCLUDED_UPDATED_FIELDS.includes(k));

        if(!isUpdatesAllowed){
            throw new Error("Unauthorised updates should not be done!");
        }

        await User.findByIdAndUpdate(id,req.body);
        res.send("Data updated successfully!😁👍");
    }catch(err){
        res.status(400).send("Unauthorised updates should not be done!");
    }
    
});






//deleting the user with the help of id
app.delete('/user/:id',async (req,res)=>{
    const id=req.params.id;
    try{
        await User.findByIdAndDelete(id);
        res.send("Deleted User successfully");
    }catch(err){
        res.status(400).send("something went wrong! couldn't deleted user");
    }
});




//First database should be connected and then only server should start listen for requests
connectDb().then(()=>{
    console.log("Database connected succesfully😅🥰🥰");
    app.listen(7777,()=>{
    console.log("Server strated serving😤😤😤😤");
});
}).catch((err)=>{
    console.error("Database connection failed😞😞😞😞");
})



