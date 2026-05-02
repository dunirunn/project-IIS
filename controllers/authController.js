const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { getDb } = require("../db");

const JWT_SECRET = "comicnest_secret_key";

const register = async (req, res) => {
  try {
    const db = getDb();

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email and password are required"
      });
    }

    const existingUser = await db.get(
      `
      SELECT * FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
      `,
      [username, email, hashedPassword]
    );

    const newUser = await db.get(
      `
      SELECT id, username, email, createdAt
      FROM users
      WHERE id = ?
      `,
      [result.lastID]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to register user"
    });
  }
};

const login = async (req, res) => {
  try {
    const db = getDb();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await db.get(
      `
      SELECT * FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to login"
    });
  }
};

module.exports = {
  register,
  login
};