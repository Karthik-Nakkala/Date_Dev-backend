const express = require("express");
const ChatModel = require("../models/chats");
const authUser=require("../middlewares/auth")

const chatRouter = express.Router();

chatRouter.get("/getchats", authUser, async (req, res) => {
  const participants = req.query['participants[]'];


  try {
    let chats = await ChatModel.find({
      participants: { $all: participants },
    }).populate({
        path:"messages.senderId",
        select:"firstName lastName"
    });
    console.log("Here is brahmi and darling chats=>",chats)
    if(!chats){
        chats=await new ChatModel({
            participants:participants,
            messages:[]
        })
        await chats.save();
    }
    console.log("success");
    res.json(chats);
  } catch (err) {
    console.log(err);
  }

});

module.exports = chatRouter;
