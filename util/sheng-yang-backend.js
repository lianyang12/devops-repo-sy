const { GameDatabase } = require("../models/GameDatabase");
const fs = require("fs").promises;

async function readJSON(filename) {
  try {
    const data = await fs.readFile(filename, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading JSON file:", err);
    return [];
  }
}

async function writeJSON(object, filename) {
  try {
    const allObjects = await readJSON(filename);
    allObjects.push(object);
    await fs.writeFile(filename, JSON.stringify(allObjects), "utf8");
    return allObjects;
  } catch (err) {
    console.error("Error writing to JSON file:", err);
    throw err;
  }
}

async function addGame(req, res) {
  const { name, price, image } = req.body;
  try {
    if (!price || isNaN(parseFloat(price))) {
      return res.status(400).json({ message: "Invalid or missing price" });
    }

    const allGames = await readJSON("./util/gameDatabase.json");
    if (allGames.some((game) => game.name === name)) {
      return res.status(400).json({ message: "Game already exists" });
    }

    const newData = new GameDatabase(
      name,
      price_float,
      image || "https://via.placeholder.com/150"
    );
    const updatedData = await writeJSON(newData, "./util/gameDatabase.json");

    return res.status(201).json(updatedData);
  } catch (error) {
    console.error("Error adding game:", error);
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { addGame, readJSON, writeJSON };
