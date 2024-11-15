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

async function viewGames(req, res) {
    try {
        const gameDatabase = await readJSON('util/gameDatabase.json');
        return res.status(201).json(gameDatabase);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { viewGames, readJSON, writeJSON };