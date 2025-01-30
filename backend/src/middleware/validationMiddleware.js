const { ZodError } = require("zod");
/**
 * Zod schema validation middleware
 */
const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: err.errors,
      });
    }
    next(err);
  }
};

module.exports = validateRequest;
