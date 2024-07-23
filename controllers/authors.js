const router = require("express").Router();
const { Blog } = require("../models/index.js");
const { User } = require("../models/index.js");
const Sequelize = require("sequelize");

console.log(User);

router.get("/", async (req, res) => {
  //   const groupBy = { group: "author" };
  const blogs = await Blog.findAll({
    attributes: [
      "author",
      [Sequelize.fn("COUNT", Sequelize.col("author")), "blogCount"],
      [Sequelize.fn("SUM", Sequelize.col("likes")), "totalLikes"],
    ],
    group: ["author"],
    order: [[Sequelize.fn("SUM", Sequelize.col("likes")), "DESC"]],
  });
  res.json(blogs);
});

module.exports = router;
