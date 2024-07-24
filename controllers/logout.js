const router = require("express").Router();
const tokenExtractor = require("../middlewares/tokenExtractor");
const sessionValidator = require("../middlewares/sessionValidator");

router.delete("/", tokenExtractor, sessionValidator, async (req, res) => {
  console.log("Logging out user", req.session.userId);
  req.session.destroy();

  console.log("User logged out successfully");
  res.status(204).end();
});

module.exports = router;
