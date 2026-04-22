const express = require('express');
const app = express();
const port = 3000;

const path = require('path');
const fs = require('fs').promises;
const logger  = require('./middleware/logger');
console.log(logger);

app.use(express.json());
app.use(logger);

const dataPath = path.join(__dirname, 'data', 'announcements.json');

// Helper functions to read and write the announcements data
async function readAll() {
  const raw = await fs.readFile(dataPath, 'utf8');
  console.log("readAll called");
  return JSON.parse(raw);
}

async function writeAll(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
}

app.get('/announcements', async (req, res) => {
  // const announcements = await readAll();
  // res.json(announcements);
  try {
    const announcements = await readAll();
    res.json({ count: announcements.length, announcements: announcements })
    // res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read announcements' });
  }

});


app.get("/announcements/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const announcements = await readAll();
    const announcement = announcements.find((ann) => ann.id === id);
    if (announcement) {
      res.json(announcement);
    } else {
      res.status(404).json({ error: 'Announcement not found' });
    }
  }catch (err) {
    res.status(500).json({ error: 'Failed to read announcements' });
  }
});



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});