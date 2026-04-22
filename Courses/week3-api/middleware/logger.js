const fs   = require('fs').promises;
const path = require('path');
const LOG  = path.join(__dirname, '..', 'log.txt');

async function logger(req, res, next) {
    const line = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
    await fs.appendFile(LOG, line + '\n').catch(() => {});
    console.log(line);
    next();
}

module.exports = logger;