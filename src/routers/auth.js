const express = require("express");
const validateSignupData = require("../helpers/validtion");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validator = require("validator");
const multer= require('multer');
const cloudinary=require('../helpers/cloudinaryConfig');
const upload=require('../helpers/profileImage');

const authRouter = express.Router();

//signup api
authRouter.post("/signup", upload.single('profileImage'), async (req, res) => {
  try {
    if (req.body.skills && typeof req.body.skills === "string") {
      try {
        req.body.skills = JSON.parse(req.body.skills);
      } catch (e) {
        req.body.skills = [];
      }
    }

    if (req.file) {
      const fileBuffer = req.file.buffer.toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${fileBuffer}`;
      
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
          folder: 'user_profiles',
        });
        
        // Inject Cloudinary's secure web URL directly into req.body so validators pass smoothly
        req.body.photoUrl = cloudinaryResponse.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary Upload Error:", cloudErr.message || cloudErr);
        throw new Error(
          "Cloudinary image upload failed (HTTP 403: Invalid or expired Cloudinary API credentials in backend .env). Please provide valid Cloudinary API keys or use a Photo URL instead."
        );
      }
    }
    //All fields validation

    validateSignupData(req, res);

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
    return res.status(500).json({ message: "Internal server error: " + err.message });
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
