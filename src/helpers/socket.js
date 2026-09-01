const socket = require("socket.io");
const ChatModel = require("../models/chats");

const initializeServer = (server) => {
  const io = socket(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    //multiple event handlers
    socket.on("sendMessage", async ({ loginUserId, targetedUserId, text }) => {
      try {
       let chat=await ChatModel.findOne({
        participants:{$all:[loginUserId,targetedUserId]}
       });
       if(!chat){
        chat=await new ChatModel({
          participants:[loginUserId,targetedUserId],
          messages:[]
        });
       }
       chat.messages.push({
        senderId:loginUserId,
        text:text,
       });
       await chat.save();
      } catch (err) {
        console.log(err);
      }

      const roomId = [loginUserId, targetedUserId].sort().join("_");
      const senderId = loginUserId;
      io.to(roomId).emit("messageReceived", { text, senderId });
    });

    socket.on("joinChat", ({ loginUserId, targetedUserId }) => {
      const roomId = [loginUserId, targetedUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeServer;
