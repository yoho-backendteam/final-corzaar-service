import axios from "axios";


export const authorize = (options = {}) => {
  const { roles = [], permission = null } = options;

  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Missing token" });
      }  

      console.log('token middleware',token)

      const response = await axios.post("http://localhost:3001/api/verify", {
        token,
        roles,
        permission,
      });

      const user = response?.data?.user;

      if (user) {
          
        if (options.length > 0 && !options.includes(user.role)) {
          console.log('user role',roles)
          return res.status(403).json({
            message: `Access denied: user role '${user.role}' not in allowed roles [${roles.join(", ")}]`,
          });
        }

        req.user = user;
        return next();
      }

      return res.status(403).json({
        message: response.data?.message || "Access denied",
      });

    } catch (error) {
      console.error("Authorization Error:", error.message);
      return res.status(401).json({
        message: "Unauthorized or invalid token",
        error: error.message,
      });
    }
  };
};
