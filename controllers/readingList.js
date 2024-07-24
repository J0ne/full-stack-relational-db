const router = require("express").Router();
const tokenExtractor = require("../middlewares/tokenExtractor");
const User = require("../models/user");
const ReadingList = require("../models/readingList");
const { BlogValidationError } = require("../util/customError");

// get for testing
router.get("/", async (request, response) => {
  const readingList = await ReadingList.findAll();
  response.json(readingList);
});

router.post("/", async (request, response) => {
  const body = request.body;

  const readingList = await ReadingList.create({
    blogId: body.blogId,
    userId: body.userId,
  });

  response.json(readingList);
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id);

  const id = req.params.id;
  const data = req.body;

  console.log("Update data", data, user.id, id);
  try {
    validateReadingListDataForUpdate(data);
    // Attempt to update the ReadingList entry
    const [affectedRows] = await ReadingList.update(data, {
      where: {
        id, // The ID of the ReadingList entry to update
        userId: user.id, // Ensures that only the user who owns this entry can update it
      },
    });

    // Check if the update was successful
    if (affectedRows === 0) {
      // Update failed
      throw new BlogValidationError(
        "Reading list update failed. Entry not found or user does not have permission."
      );
    } else {
      // Update was successful
      console.log("Update successful");
      res.status(200).send({ message: "Reading list updated successfully" });
    }
  } catch (error) {
    error.source = "reading list update";
    console.log(error);
    next(error);
  }
});

validateReadingListDataForUpdate = (data) => {
  if (data.read === undefined || typeof data.read !== "boolean") {
    throw new BlogValidationError(
      "Validation error: read is required and must be a boolean"
    );
  }
};

module.exports = router;
