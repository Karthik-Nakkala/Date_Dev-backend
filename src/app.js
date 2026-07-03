const express=require("express");
const connectDb=require('./config/database');
const User=require('./models/user');

const app=express();

app.post('/signup',async(req,res)=>{
    const newUser={
        firstName:"Karthik",
        lastName:"Yadav",
        emailId:"karthik@gmail.com",
        password:"abc123",
        age:20,
        gender:"male",
    }
    const userInstance=new User(newUser);
    try{
        await userInstance.save();
        res.send("user added successfully");
    }catch(err){
        res.status(400).send("please check your data: ",err.message);
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



