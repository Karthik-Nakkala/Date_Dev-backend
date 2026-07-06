const express=require("express");
const connectDb=require('./config/database');
const User=require('./models/user');

const app=express();

app.use(express.json());

app.post('/signup',async(req,res)=>{
    console.log(req.body);
    const userInstance=new User(req.body);
    try{
        await userInstance.save();
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("please check your data: ",err.message);
    }
});


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



