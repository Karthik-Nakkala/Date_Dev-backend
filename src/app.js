const express=require("express");

const app=express();

app.use('/thala',(req,res)=>{
    res.send("Legends never haves the retirements, They stay in out hearts forever");
})

app.use('/',(req,res)=>{
    res.send("Thala for a reason for many seasons");
});



app.listen(7777,()=>{
    console.log("Thala for a reason");
});