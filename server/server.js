require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

const app = express();
const client = new MongoClient(process.env.MONGO_URI);

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.post("/signup", async (req, res) => {
  const { f_name, l_name, username, password } = req.body;

  if (
    ![f_name, l_name, username, password].every(
      (value) => typeof value === "string" && value.trim()
    )
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const users = client.db("pa2").collection("users");
    const cleanUsername = username.trim();

    const existingUser = await users.findOne({ username: cleanUsername });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      f_name: f_name.trim(),
      l_name: l_name.trim(),
      username: cleanUsername,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Username already exists" });
    }

    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (
    typeof username !== "string" ||
    !username.trim() ||
    typeof password !== "string" ||
    !password
  ) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const users = client.db("pa2").collection("users");
    const user = await users.findOne({ username: username.trim() });

    if (!user) {
      return res.status(401).json({ message: "Username does not exist" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

async function startServer() {
  try {
    await client.connect();

    const users = client.db("pa2").collection("users");
    await users.createIndex({ username: 1 }, { unique: true });

    console.log("Connected to MongoDB");

    app.listen(9000, () => {
      console.log("Server running on port 9000");
    });
  } catch (error) {
    console.error("Could not connect to MongoDB");
    console.error(error);
  }
}

startServer();