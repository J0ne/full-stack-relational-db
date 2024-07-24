const jwt = require("jsonwebtoken");
const router = require("express").Router();

const ReadingList = require("../models/readingList");

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

module.exports = router;
