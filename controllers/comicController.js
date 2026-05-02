const { getDb } = require("../db");

const getComics = async (req, res) => {
  try {
    const db = getDb();

    const comics = await db.all(`
      SELECT * FROM comics
      ORDER BY createdAt DESC
    `);

    res.json(comics);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch comics"
    });
  }
};

const getComicById = async (req, res) => {
  try {
    const db = getDb();

    const comic = await db.get(
      `
      SELECT * FROM comics
      WHERE id = ?
      `,
      [req.params.id]
    );

    if (!comic) {
      return res.status(404).json({
        message: "Comic not found"
      });
    }

    res.json(comic);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch comic"
    });
  }
};

const createComic = async (req, res) => {
  try {
    const db = getDb();

    const { title, author, description, imageUrl } = req.body;

    if (!title || !author || !description) {
      return res.status(400).json({
        message: "Title, author and description are required"
      });
    }

    const result = await db.run(
      `
      INSERT INTO comics (title, author, description, imageUrl)
      VALUES (?, ?, ?, ?)
      `,
      [
        title,
        author,
        description,
        imageUrl || "https://placehold.co/300x450?text=Comic"
      ]
    );

    const createdComic = await db.get(
      `
      SELECT * FROM comics
      WHERE id = ?
      `,
      [result.lastID]
    );

    res.status(201).json(createdComic);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create comic"
    });
  }
};

const getRandomComics = async (req, res) => {
  try {
    const db = getDb();

    const limit = Number(req.query.limit) || 8;

    const comics = await db.all(
      `
      SELECT * FROM comics
      ORDER BY RANDOM()
      LIMIT ?
      `,
      [limit]
    );

    res.json(comics);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch random comics"
    });
  }
};

const searchComics = async (req, res) => {
  try {
    const db = getDb();

    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    const comics = await db.all(
      `
      SELECT * FROM comics
      WHERE title LIKE ?
         OR author LIKE ?
         OR description LIKE ?
      ORDER BY createdAt DESC
      `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    res.json(comics);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to search comics"
    });
  }
};

module.exports = {
  getComics,
  getComicById,
  createComic,
  getRandomComics,  
  searchComics
};