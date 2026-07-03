const express=require("express");

const app=express();

app.use('/',(err,req,res,next)=>{
    console.log("NOOO!, I will not exicute😠😠😠😠😠😠, I only run when an error get some non falsy value");
    if(err){
        res.status(500).send("Bosidikee! Nenu Amrudini, ep ni kaadhu");
    }
})

app.get('/getUserData',(req,res,next)=>{
    console.log("Yesssss!, I will exicute🥰🥰🥰🥰🥰");
    res.send("Hi, Babji, How are you?");
})

app.listen(7777,()=>{
    console.log("Thala For a Reason!");
});

