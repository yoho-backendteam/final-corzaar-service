import Profile from "../../models/setting/prosileschema.js";
import bcrypt from "bcrypt";

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    const profile = await Profile.findOne();
    const isMatch = await bcrypt.compare(currentPassword, profile.password);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    profile.password = await bcrypt.hash(newPassword, 10);
    await profile.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
