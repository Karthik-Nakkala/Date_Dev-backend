const express = require("express");
const ChatModel = require("../models/chats");
const authUser = require("../middlewares/auth");
const checkConnectionRequestExists = require("../helpers/checkConnection");
const User = require("../models/user");

const chatRouter = express.Router();

chatRouter.get("/getchats", authUser, async (req, res) => {
  const participants = req.query["participants[]"];

  try {
    const connection = await checkConnectionRequestExists(
      participants[0],
      participants[1],
    );
    if (!connection) {
      throw new Error("Connection not found");
    }
    const targettedUser = await User.findOne({ _id: participants[1] });

    const {firstName,lastName,photoUrl,skills,bio,role}=targettedUser;

    const partner={
      name: firstName+' '+lastName,
      avatar: photoUrl,
      skills : skills,
      about : bio,
      role : role
    }

    let chats = await ChatModel.findOne({
      participants: { $all: participants },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chats) {
      chats = await new ChatModel({
        participants: participants,
        messages: [],
      });
      await chats.save();
    }
    res.json({
      chats: chats,
      targetedUser: partner,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = chatRouter;
