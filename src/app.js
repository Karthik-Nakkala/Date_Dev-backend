const express=require("express");
const connectDb=require('./config/database');
const cookieParser=require('cookie-parser');
const authRouter=require('./routers/auth');
const profileRouter=require('./routers/profile');
const connectReqRouter=require('./routers/connectReq');

const app=express();

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',connectReqRouter);




//First database should be connected and then only server should start listen for requests
connectDb().then(()=>{
    console.log("Database connected succesfully😅🥰🥰");
    app.listen(7777,()=>{
    console.log("Server strated serving😤😤😤😤");
});
}).catch((err)=>{
    console.error("Database connection failed😞😞😞😞");
})



