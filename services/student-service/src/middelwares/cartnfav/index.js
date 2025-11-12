export const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property];
    if (!schema || typeof schema.validate !== "function") {
      return res.status(500).json({ success: false, message: "Internal validation error" });
    }

    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const details = error.details.map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: details,
      });
    }
    next();
  };
};
