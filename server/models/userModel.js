import mongoose from "mongoose";

// first we create a schema
// Here we have to define the structure of our user data
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true, //email should be unique
  },

  password: {
    type: String,
    required: true,
  },

  verifyOtp: {
    type: String,
    default: "",
  },

  verifyOtpExpiresAt: {
    type: Number,
    default: 0,
  },

  isAccountVerified: {
    type: Boolean,
    default: false,
  },

  resetOtp: {
    type: String,
    default: "",
  },

  resetOtpExpiresAt: {
    type: Number,
    default: 0,
  },
});

// Using this userSchema, we create the userModel
// This userModel will only be created if it is not already created
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;