const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const { BlogValidationError } = require("../util/customError");
const tokenExtractor = require("../middlewares/tokenExtractor");
const { Op } = require("sequelize");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const validateNewBlog = (blog) => {
  if (typeof blog.title !== "string" || blog.title.trim() === "") {
    throw new BlogValidationError(
      "Validation error: title is required and must be a non-empty string"
    );
  }
  if (typeof blog.author !== "string" || blog.author.trim() === "") {
    throw new BlogValidationError(
      "Validation error: author is required and must be a non-empty string"
    );
  }

  if (typeof blog.url !== "string" || blog.url.trim() === "") {
    throw new BlogValidationError(
      "Validation error: url is required and must be a non-empty string"
    );
  }
};

const validateBlogForUpdate = (blog) => {
  console.log("Validating blog for update", blog);
  // require likes to be a set and to be number
  if (blog.likes === undefined) {
    throw new BlogValidationError("Validation error: likes is required");
  }

  if (blog.likes !== undefined && typeof blog.likes !== "number") {
    throw new BlogValidationError("Validation error: likes must be a number");
  }
};

router.get("/", async (req, res) => {
  let where = {};

  if (req.query.search) {
    where.title = {
      [Op.iLike]: `%${req.query.search}%`,
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
  });

  res.json(blogs);
});

router.get("/:id", blogFinder, async (req, res) => {
  const blog = req.blog;
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    // validate user
    const user = await User.findByPk(req.decodedToken.id);

    const newBlog = req.body;
    validateNewBlog(newBlog);

    const createdBlog = await Blog.create({ ...newBlog, userId: user.id });
    return res.json(createdBlog);
  } catch (error) {
    error.source = "blog creation";
    console.log(error);
    next(error);
  }
});

router.put("/:id", blogFinder, async (req, res, next) => {
  const id = req.params.id;
  const blog = req.body;

  try {
    validateBlogForUpdate(blog);
    await Blog.update(blog, {
      where: {
        id,
      },
    });
    res.status(200).send({ message: "Blog updated successfully" });
  } catch (error) {
    error.source = "blog update";
    console.log(error);
    next(error);
  }
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
  const blog = req.blog;
  if (blog.userId !== req.decodedToken.id) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  if (blog) {
    await blog.destroy();
    return res
      .status(204, {
        message: "Blog deleted successfully",
      })
      .end();
  } else {
    return res.status(404).end();
  }
});

const printBlogs = async () => {
  const blogs = await Blog.findAll();
  console.log(blogs.map((blog) => blog.toJSON()));
};

// printBlogs();

module.exports = router;
