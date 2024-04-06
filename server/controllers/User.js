const express = require('express');
const User = require('../models/User');
const { sendEmail } = require('../middlewares/sendMail');

exports.register = async (req, res) => {
    try {
      const { name, email, password, contact, address } = req.body;
  
        const public_id = "sample id"
        const url = ""
      
        // await cloudinary.uploader.upload(req.file.path, (err, result) => {
        //   if (err) console.log(err);
        //   url = result.url;
        //   public_id = result.public_id;
        // });
        // console.log("url" + url);
      
  
      let user = await User.findOne({ email });
  
  
      if (user && user.isVerified) {
        return res.status(401).json({
          success: false,
          message: "User already exists",
        });
      }
  
      if (!user) {
        user = await User.create({
          name,
          email,
          password,
          contact,
          address,
          avtar: { url, public_id },
        });
        const otp = await user.generateOTP();
  
        user.verifyOTP = `${otp}`;
        user.verifyOTPexpires = new Date(Date.now() + 10 * 60 * 1000);
  
        await user.save();
        await sendEmail({
          email,
          subject: "OTP from Enotes",
          message: `your OTP is ${otp}`,
        });
  
        res.status(200).json({
          success: true,
          otp,
          message: "OTP sent Successfully to your email",
        });
      } else {
        const otp = await user.generateOTP();
        console.log(`Your OTP is ${otp}`);
  
        user.verifyOTP = `${otp}`;
        user.verifyOTPexpires = new Date(Date.now() + 1 * 60 * 1000);
  
        await user.save();
        await sendEmail({
          email: user.email,
          subject: "OTP from Enotes",
          message: `your OTP is ${otp}`,
        });
  
        res.status(200).json({
          success: true,
          otp,
          message: "OTP sent Successfully to your email",
        });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        error: e.message,
      });
    }
  };

  exports.verifyOTP = async (req, res) => {
    try {
      const { otp, email } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      // console.log(user.verifyOTPexpires.getTime() + " " + Date.now());
  
  
      if (user.verifyOTP != otp) {
        return res.status(404).json({
          success: false,
          message: "INVALID otp",
        });
      }
  
      user.isVerified = true;
      user.save();
  
      const token = await user.generateToken();
  
      res.cookie("token", token, {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }).status(200).json({
          success: true,
          user,
          message: "user Verified",
        });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  };

  exports.login = async (req, res) => {
    try {
      const { email, password, isGoogle } = req.body;
  
      if (isGoogle === true) {
        const user = await User.findOne({ email: email });
        console.log("User", user);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "User not found",
          });
        }
        const token = await user.generateToken();
        return res
          .cookie("token", token, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          })
          .status(200)
          .json({
            success: true,
            user,
          });
      }
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Enter Credentials",
        });
      }
  
      const user = await User.findOne({ email: email }).select("+password");
  
      if (!user || !user.isVerified) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const isMatch = await user.matchPassword(password);
  
      if (!isMatch) {
        return res.status(404).json({
          success: false,
          message: "Invalid Credentials",
        });
      }
  
      const token = await user.generateToken();
  
      res
        .cookie("token", token, {
          expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .status(200)
        .json({
          success: true,
          user,
        });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  };

  exports.logout = async (req, res) => {
    try {
      res
        .status(200)
        .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
        .json({
          success: true,
          message: "Logout Successfully",
        });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  };

  exports.loadUser = async (req, res) => {
    try {
      const { token } = req.cookies;
  
      if (!token) {
        return res.status(404).json({
          success: false,
          message: "Login First",
        });
      }
  
      const decoded_id = await jwt.verify(token, process.env.JWT_SECRET);
  
      const user = await User.findOne({ _id: decoded_id._id });
  
      res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  };