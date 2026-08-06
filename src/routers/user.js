const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const User = require("../models/user");
const ConnectReq = require("../models/connectReq");
const { connection } = require("mongoose");

//to get all usersprofiles like feed
userRouter.get("/user/feed", userAuth, async (req, res) => {
  const limitPerPage = req.query.limit || 9;
  const skipDocs = (req.query.page - 1) * limitPerPage || 0;

  try {
    const loggedInUser = req.user;
    //take all current login user connection requests either he sent,he received, he rejcted,he accepted,etc
    const userConnectionRequests = await ConnectReq.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId"); //slect is for getting only that data fields from db collection

    const uniqueUserReqConnectIds = [];

    uniqueUserReqConnectIds.push(loggedInUser._id);

    userConnectionRequests.forEach((request) => {
      if (request.fromUserId.toString() === loggedInUser._id.toString()) {
        uniqueUserReqConnectIds.push(request.toUserId);
      } else {
        uniqueUserReqConnectIds.push(request.fromUserId);
      }
    });

    const feedUsers = await User.find({
      _id: { $nin: uniqueUserReqConnectIds },
    })
      .skip(skipDocs)
      .limit(limitPerPage);

    res.json({
      message: "ALl feed users successfully fetched",
      feedUsers,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//for getting all received requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const requests = await ConnectReq.find({
      toUserId: req.user._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "emailId",
      "age",
      "photoUrl",
      "gender",
      "skills",
      "verified",
      "bio",
      "company",
      "location",
      "openForWars",
      "role",
      "connections",
      "hackathons",
      "projects",
    ]);

    res.send({
      message: "All Requests received successfully",
      requests,
    });
  } catch (err) {
    res.status(400).send("Bad Request: " + err.message);
  }
});

//for getting all connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const connections = await ConnectReq.find({
      $or: [
        { toUserId: loggedInuser._id, status: "accepted" },
        { fromUserId: loggedInuser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserId",
        "firstName lastName skills role isVerified photoUrl",
      )
      .populate(
        "toUserId",
        "firstName lastName skills role isVerified photoUrl",
      );

    const data = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInuser._id)) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });

    res.json({
      message: "All connections fetched successfully",
      data,
    });
  } catch (err) {
    res.status(400).send("Bad Request: " + err.message);
  }
});

module.exports = userRouter;
