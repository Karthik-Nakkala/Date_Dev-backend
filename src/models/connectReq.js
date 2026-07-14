const mongoose=require('mongoose');

const connectReqSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
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



connectReqSchema.index({fromUserId:1,toUserId:1},{unique:true});

connectReqSchema.pre('save', function(){
    const fromUserId=this.fromUserId;
    const toUserId=this.toUserId;


    //what if user is sending request to himself ?
    if(toUserId.equals(fromUserId)){
            throw new Error("Invalid request! self-requests are not allowed");
    }

    //what if either avanthika is sending request again to baahubali second time or else before only baahubali send request to avanthika 



})

const ConnectReq=mongoose.model('ConnectReq',connectReqSchema);

module.exports=ConnectReq;