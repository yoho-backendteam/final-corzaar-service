export const PermissionVerify = (resource = []) => (req, res, next) => {
  try {
    const userHeader = req.headers["user"];

    if (!userHeader) {
      return res.status(400).json({ status: "failed", message: "User header is missing" });
    }

    let user;
    try {
      user = JSON.parse(userHeader);
    } catch (err) {
      return res.status(400).json({ status: "failed", message: "Invalid user header JSON" });
    }

    const userRole = user?.role;

    if (resource.includes(userRole) || userRole === "open") {
      req.userType = userRole;
      req.user = user;
      return next();
    } else {
      return res.status(401).json({ status: "not_permitted", message: "You are not allowed to access" });
    }

  } catch (error) {
    console.error("Permission middleware error:", error);
    return res.status(500).json({ status: "failed", message: "Internal server error" });
  }
};
