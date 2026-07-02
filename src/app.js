const express=require("express");

const app=express();

app.get('/user',(req,res)=>{
    res.send({name:"Karthik",role:"Fullstack Developer"});
});

app.post("/user",(req,res)=>{
    res.send("User had been posting");
})

app.put("/user",(req,res)=>{
    res.send("User is updating entire document!");
})

app.patch("/user",(req,res)=>{
    res.send("User is updating some of fields in document");
})

app.delete("/user",(req,res)=>{
    res.send("User is deleting data");
})



app.listen(7777,()=>{
    console.log("Thala for a reason");
});