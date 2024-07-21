const router = require("express").Router();
const Blog = require("../models/blog");
const { BlogValidationError } = require("../util/customError");

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
  const blogs = await Blog.findAll();
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

router.post("/", async (req, res, next) => {
  try {
    const newBlog = req.body;
    validateNewBlog(newBlog);
    const createdBlog = await Blog.create(newBlog);
    return res.json(createdBlog);
  } catch (error) {
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
    console.log(error);
    next(error);
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  const blog = req.blog;

  if (!blog) {
    return res.status(404).end();
  }

  blog.destroy();

  res.status(204).end();
});

const printBlogs = async () => {
  const blogs = await Blog.findAll();
  console.log(blogs.map((blog) => blog.toJSON()));
};

// printBlogs();

module.exports = router;
