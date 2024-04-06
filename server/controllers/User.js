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