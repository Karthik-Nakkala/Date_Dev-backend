const express=require("express");

const app=express();

app.get('/rebelhood',(req,res,next)=>{
    next();
    console.log("They are none other than, The great Jakkanna and The Dinosaur/Karna/RaguNandhana/Mr.Perfect/Darling");
    res.send({
        name:"Praboss",
        profession:"Being in Hearts for millions",
    });
},[(req,res,next)=>{
    console.log("Every face He wear becomes his real face. The world doesn't remember him, The world remembers who he pretended to be");
    next();
},(req,res,next)=>{
    console.log("Baahubali is a war for him");
    next();
},(req,res,next)=>{
    console.log("But, He is a dinosaur, no war stops him");
    next();
}],(req,res,next)=>{
    console.log("From Bahubali, Two Men are still never looking back!, Guess Who are them?");
    next();
},)



app.listen(7777,()=>{
    console.log("Whole India, Only one hood is there, That is Rebelhood!");
});