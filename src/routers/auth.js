const express = require("express");
const validateSignupData = require("../helpers/validtion");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const multer = require("multer");
const insertPhotoUrl = require("../helpers/insertPhotoUrl");
const upload = require("../helpers/profileImage");

const authRouter = express.Router();

//signup api
authRouter.post("/signup", upload.single("profileImage"), async (req, res) => {
  try {
    //since data comming in formdata from client, will check skills section and inserts skills as array to re.body.skills
    if (req.body.skills && typeof req.body.skills === "string") {
      try {
        req.body.skills = JSON.parse(req.body.skills);
      } catch (err) {
        req.body.skills = [];
      }
    }

    //stores image in cloudinary & inserts its link to req.body.photourl
    try {
      const secure_url = await insertPhotoUrl(req.file);
      if (secure_url) {
        req.body.photoUrl = secure_url;
      }
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    //All fields validation

    try {
      // Pass req.body directly to the validation function
      validateSignupData(req.body);
    } catch (validationErr) {
      // Halts execution instantly if any validation fails
      return res.status(400).json({ error: validationErr.message });
    }

    console.log("Here is request body",req.body);

    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      photoUrl,
      skills,
      location,
      role,
      bio,
      projects,
      hackathons,
      openForWork,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const userInstance = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      skills,
      location,
      role,
      bio,
      projects,
      hackathons,
      openForWork,
    });
    await userInstance.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

//login api
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Enter valid email address");
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isValidUser = await user.validatePassword(password);

    if (isValidUser) {
      const userSafeData = user.getUserSafeData();
      //creating the jsonwebtoken
      const token = await user.getJWT();

      //sending the created token to client
      res.cookie("authToken", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      });
      res.send(userSafeData);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error: " + err.message });
  }
});

//log out api
authRouter.post("/logout", (req, res) => {
  try {
    res.cookie("authToken", null, { expires: new Date() }); //new Date()==new Date(Date.now())
    res.send("Logout successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = authRouter;
