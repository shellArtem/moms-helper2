// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3001; // Порт для бэкенда

app.use(cors());
app.use(bodyParser.json());

const staticPath = path.join(__dirname, 'public/images');

console.log("-----------------------------------------");
console.log("СЕРВЕР ИЩЕТ КАРТИНКИ В ПАПКЕ:", staticPath);
console.log("-----------------------------------------");

app.use('/images', express.static(staticPath));
// app.use('/images', express.static(path.join(__dirname, 'public/images')));
// Роуты для нашего API
app.use('/api', apiRoutes);

// Обслуживание статических файлов (картинок)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});