const express=require("express");
const connectDb=require('./config/database');
const cookieParser=require('cookie-parser');
const authRouter=require('./routers/auth');
const profileRouter=require('./routers/profile');
const connectReqRouter=require('./routers/connectReq');
const userRouter = require("./routers/user");

const app=express();

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',connectReqRouter);
app.use('/',userRouter);




//First database should be connected and then only server should start listen for requests
connectDb().then(()=>{
    console.log("Database connected succesfully😅🥰🥰");
    app.listen(7777,()=>{
    console.log("Server started serving😤😤😤😤");
});
}).catch((err)=>{
    console.error("Database connection failed😞😞😞😞");
})



