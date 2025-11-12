export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((err) => err.message);
    return res.status(400).json({ success: false, message: "Validation failed", errors: details });
  }
  next();
};
