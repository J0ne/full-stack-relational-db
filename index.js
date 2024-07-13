require("dotenv").config();
const { Sequelize, DataTypes, Model } = require("sequelize");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Note extends Model {}

Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "note",
  }
);

app.get("/api/notes", async (req, res) => {
  const notes = await Note.findAll();
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  console.log(req);
  try {
    const note = await Note.create(req.body);
    return res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
