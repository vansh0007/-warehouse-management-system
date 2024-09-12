const fs = require('fs').promises;
const path = require('path'); // Add this line

async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(path.join(__dirname, '../data', filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    throw error;
  }
}

module.exports = { readJsonFile };