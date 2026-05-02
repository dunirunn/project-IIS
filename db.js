const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

const initDb = async () => {
  db = await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS comics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT NOT NULL,
      imageUrl TEXT DEFAULT 'https://placehold.co/300x450?text=Comic',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("SQLite database connected");
};

const getDb = () => {
  if (!db) {
    throw new Error("Database is not initialized");
  }

  return db;
};

module.exports = {
  initDb,
  getDb
};