const jwt = require("jsonwebtoken");
const logger = require("./logger");

const generateTokens = (payload) => {
  try {
    // console.log("JWT_ACCESS_SECRET:", process.env.JWT_ACCESS_SECRET);
    // console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // console.log("Generated Access Token:", accessToken);
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error(`Token generation failed: ${error.message}`);
    throw new Error("Token generation failed");
  }
};

const verifyToken = (token, type = "access") => {
  try {
    const secret =
      type === "access"
        ? process.env.JWT_ACCESS_SECRET
        : process.env.JWT_REFRESH_SECRET;

    return jwt.verify(token, secret);
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`);
    throw new Error("Invalid token");
  }
};

module.exports = { generateTokens, verifyToken };
