const express = require("express");
const cors = require("cors");

const { initDb } = require("./db");

const authRoutes = require("./routes/authRoutes");
const comicRoutes = require("./routes/comicRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/express_backend", (req, res) => {
  res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" });
});

app.use("/api", authRoutes);
app.use("/api/comics", comicRoutes);

initDb().then(() => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});