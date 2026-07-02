const express=require("express");
const {adminAuth,userAuth}=require('./middlewares/auth');

const app=express();

app.post('/user/login',(req,res)=>{
    res.send("User is loggining in!");
});

app.get('/user',userAuth,(req,res)=>{
    res.send("Users of this Application are really god gifted childs🥰🥰🥰🥰");
});

app.get('/admin/getData',adminAuth,(req,res)=>{
         res.send("You had all data from database, please check it after you kept data in database😅");
});

app.get('/admin/deleteData',adminAuth,(req,res)=>{
         res.send("You had the access for delete all the data🙂🙂🙂🙂");
});

app.listen(7777,()=>{
    console.log("Thala For a Reason!");
});

