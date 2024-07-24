const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const errorHandler = require("./middlewares/errorHandler");
const blogsRouter = require("./controllers/blogs");

const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const readingListRouter = require("./controllers/readingList");

app.use(express.json());
app.use(bodyParser.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readinglist", readingListRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
