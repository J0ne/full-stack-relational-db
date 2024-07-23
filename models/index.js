const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");

User.hasMany(Blog);
Blog.belongsTo(User);
User.hasOne(ReadingList);
ReadingList.belongsTo(Blog, { foreignKey: "blog_id" });
ReadingList.belongsTo(User, { foreignKey: "user_id" });

// Blog.sync({ alter: true });
// User.sync({ alter: true });

module.exports = { Blog, User };
