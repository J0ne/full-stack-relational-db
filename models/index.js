const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./readingList");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: ReadingList, as: "readings" });
Blog.belongsToMany(User, { through: ReadingList, as: "usersReads" });

User.hasMany(ReadingList);
ReadingList.belongsTo(User);

Blog.hasMany(ReadingList);
ReadingList.belongsTo(Blog);

User.hasOne(Session);

module.exports = { Blog, User, ReadingList };
