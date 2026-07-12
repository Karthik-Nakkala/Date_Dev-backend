const mongoose=require('mongoose');

const connectReqSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,

    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,

    },
    status:{
        type:String,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:`{Value} is not valid status`,
        },
        required:true,
    },

},{
    timestamps:true
});

const ConnectReq=mongoose.model('ConnectReq',connectReqSchema);

module.exports=ConnectReq;