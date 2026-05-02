const express = require("express");

const {
  getComics,
  getComicById,
  createComic,
  getRandomComics,
  searchComics
} = require("../controllers/comicController");

const router = express.Router();

router.get("/", getComics);
router.get("/random", getRandomComics);
router.get("/search", searchComics);
router.get("/:id", getComicById);
router.post("/", createComic);

module.exports = router;