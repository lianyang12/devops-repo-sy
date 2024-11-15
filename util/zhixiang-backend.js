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

async function getGames(req, res) {
    try {
        const gameDatabase = await readJSON('util/gameDatabase.json');
        return res.status(201).json(gameDatabase);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function editGame(req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const price = req.body.price;
        const image = req.body.image;
        const gameDatabase = await readJSON('util/gameDatabase.json');
        var modified = false;
        for (var i = 0; i < gameDatabase.length; i++) {
            var curcurrResource = gameDatabase[i];
            if (curcurrResource.id !== id && curcurrResource.name == name) {
                return res.status(500).json({ message: 'Error: Game already exist!' });
            }
            else if (curcurrResource.id == id) {
                gameDatabase[i].name = name;
                gameDatabase[i].price = price;
                gameDatabase[i].image = image;
                modified = true;
            }
        }
        if (modified) {
            await fs.writeFile('util/gameDatabase.json', JSON.stringify(gameDatabase), 'utf8');
            return res.status(201).json({ message: 'Game modified successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to modify!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteGame(req, res) {
    try {
        const id = req.params.id;
        const gameDatabase = await readJSON('util/gameDatabase.json');
        var index = -1;
        for (var i = 0; i < gameDatabase.length; i++) {
            var currentGame = gameDatabase[i];
            if (currentGame.id == id)
                index = i;
        }

        if (index != -1) {
            gameDatabase.splice(index, 1);
            await fs.writeFile('util/gameDatabase.json', JSON.stringify(gameDatabase), 'utf8');
            return res.status(201).json({ message: 'Game deleted successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to delete!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getGames, editGame, deleteGame, readJSON, writeJSON };