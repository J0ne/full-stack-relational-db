const Session = require("../models/session");
const User = require("../models/user"); // Import the User model

const sessionValidator = async (req, res, next) => {
  try {
    if (!req.decodedToken) {
      return res.status(401).json({ error: "Token validation failed" });
    }

    const session = await Session.findOne({
      where: { userId: req.decodedToken.id },
    });

    if (!session) {
      return res
        .status(401)
        .json({ error: "Invalid session or session expired" });
    }

    // find the user
    const user = await User.findOne({
      where: { id: req.decodedToken.id },
    });

    // Check if the user is disabled
    if (user.disabled) {
      return res.status(403).json({ error: "User account is disabled" });
    }

    req.session = session;

    next();
  } catch (error) {
    console.error("Session validation error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = sessionValidator;
