// Here we create different controller functions
// register, login, logout, verifyAccount, resetPassword

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    // check if the user already exists using emailID
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exist!" });
    }
    // hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    //create the new user
    const user = new userModel({
      name,
      email,
      password: hashPassword,
    });
    // save the user
    await user.save();

    //  create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // send the token in a HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // when this runs on live server(https), it is secure and when it runs on localhost(http), it is not secure
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Strict as both backend and front end run on the same environment(localhost). In live server, it is none
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Sending Welcome Email to the user
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to our website",
      text: `Hello ${name}, Your Account has been created with email id : ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "User Registerd Successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and Password are required!",
    });
  }

  try {
    // Find wether the user exists or not
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password!" });
    }

    //  create a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // send the token in a HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Login Successful!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out Successfully!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account is already verified!",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verificationn OTP",
      text: `Your OTP is ${otp}. Verify your account usint this otp.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Verification OTP sent on email!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify the email using OTP
export const verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.json({ success: false, message: "Missing Details!" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found!" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP!" });
    }

    if (user.verifyOtpExpiresAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired!" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpiresAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Account Verified Successfully!",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Send password reset OTP
export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({ success: false, message: "Email is required!" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User Not Found!" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 Minutes

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}. Use this OTP t0 proceed with resetting your password.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Reset OTP sent on email!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reset User Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, new password is required!",
    });
  }

  try {

    const user = await userModel.findOne({ email });

    if(!user) {
        return res.json({success: false, message: "User Not Found!"})
    }

    if(user.resetOtp === "" || user.resetOtp !== otp) {
        return res.json({success: false, message: "Invalid OTP!"})
    }

    if(user.resetOtpExpiresAt < Date.now()) {
        return res.json({success: false, message: "OTP Expired!"})
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpiresAt = 0;

    await user.save();

    return res.json({success: true, message: "Password Reset Successfully!"})

  } catch (error) {}
};
