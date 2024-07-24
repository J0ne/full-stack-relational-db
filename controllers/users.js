const router = require("express").Router();
const { Blog } = require("../models/index.js");
const { User } = require("../models/index.js");
const { ReadingList } = require("../models/index.js");
const { Op } = require("sequelize");

console.log(User);

router.get("/", async (req, res) => {
  console.log("GET /api/users");
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    error.source = "user creation";
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  let whereForReadingList = {};

  if (req.query?.read) {
    whereForReadingList = {
      read: req.query.read === "true",
    };
  }

  const user = await User.findByPk(userId, {
    attributes: { exclude: [""] },
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId"] },
        through: { attributes: [] },
        include: [
          {
            model: ReadingList,
            attributes: { exclude: ["blogId", "userId"] },
            where: {
              userId: userId,
              ...whereForReadingList,
            },
          },
        ],
      },
    ],
  });

  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res, next) => {
  const user = req.body;
  try {
    await User.update(user, {
      where: {
        username: req.params.username,
      },
    });
    res.status(200).send({ message: "User updated successfully" });
  } catch (error) {
    error.source = "user update";
    next(error);
  }
});

module.exports = router;
