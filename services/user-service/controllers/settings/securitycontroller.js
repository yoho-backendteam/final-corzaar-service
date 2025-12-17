import Profile from "../../models/setting/prosileschema.js";
import bcrypt from "bcrypt";
import { logActivity } from "../../utils/ActivitylogHelper.js";

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = req.user

    const profile = await Profile.findOne();
    const isMatch = await bcrypt.compare(currentPassword, profile.password);
    if (!isMatch) return res.status(400).json({ message: "Current password incorrect" });

    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    profile.password = await bcrypt.hash(newPassword, 10);
    await profile.save();
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Password",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"} Password updated successfully`,
    });


    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
