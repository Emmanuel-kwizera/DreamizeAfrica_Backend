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
    res.status(500).json({ error: err.message });
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

app.post('/announcements/add', async (req, res) => {
  try {
    const { title, message, category } = req.body;
    const announcements = await readAll();
    const newId = announcements.length > 0 ? Math.max(...announcements.map(ann => ann.id)) + 1 : 1;
    const newAnnouncement = { id: newId, title, message, category };

    announcements.push(newAnnouncement);
    await writeAll(announcements);
    res.status(201).json(newAnnouncement);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/announcements/delete/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    const announcements = await readAll();
    const index = announcements.findIndex((ann) => ann.id === id);
    if (index !== -1) {
      const deletedAnnouncement = announcements.splice(index, 1)[0];
      await writeAll(announcements);
      res.json(deletedAnnouncement);
    } else {
      res.status(404).json({ error: 'Announcement not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });     
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
