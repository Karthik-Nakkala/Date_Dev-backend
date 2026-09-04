const socket = require("socket.io");
const ChatModel = require("../models/chats");
const checkConnectionRequestExists=require('./checkConnection');

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
        const connection = await checkConnectionRequestExists(
          loginUserId,
          targetedUserId,
        );
        if (!connection) {
          throw new Error("Connection request not found!");
        }
        let chat = await ChatModel.findOne({
          participants: { $all: [loginUserId, targetedUserId] },
        });
        if (!chat) {
          chat = await new ChatModel({
            participants: [loginUserId, targetedUserId],
            messages: [],
          });
        }
        chat.messages.push({
          senderId: loginUserId,
          text: text,
        });
        await chat.save();
        const roomId = [loginUserId, targetedUserId].sort().join("_");
        const senderId = loginUserId;
        io.to(roomId).emit("messageReceived", { text, senderId });
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("joinChat", async ({ loginUserId, targetedUserId }) => {
      try {
        const connection = await checkConnectionRequestExists(
          loginUserId,
          targetedUserId,
        );
        if (!connection) {
          throw new Error("Connection request not found!");
        }
        const roomId = [loginUserId, targetedUserId].sort().join("_");
        socket.join(roomId);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeServer;
