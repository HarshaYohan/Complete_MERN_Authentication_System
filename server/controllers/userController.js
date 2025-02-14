import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
  const { userId } = req.body;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.json({ success: false, message: "User Not Found!" });
  }

  return res.json({
    success: true,
    userData: {
      name: user.name,
      isAccountVerified: user.isAccountVerified,
    },
  });
};
