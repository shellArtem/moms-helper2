// backend/routes/api.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const multer = require('multer');
const sharp = require('sharp');
const crypto = 'crypto';

const articlesFilePath = path.join(__dirname, '..', 'data', 'articles.json');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Хелпер для чтения данных
const readArticles = () => {
  const data = fs.readFileSync(articlesFilePath, 'utf-8');
  return JSON.parse(data);
};

// Хелпер для записи данных
const writeArticles = (data) => {
  fs.writeFileSync(articlesFilePath, JSON.stringify(data, null, 2));
};

router.post('/admin/upload-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Файл не загружен' });
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `article-${uniqueSuffix}.webp`;
    const outputPath = path.join(__dirname, '..', 'public', 'images', filename);

    await sharp(req.file.buffer)
      .webp({ quality: 80 }) // Конвертируем в WebP с качеством 80
      .toFile(outputPath);

    // Возвращаем публичный путь к файлу
    res.json({ filePath: `/images/${filename}` });

  } catch (error) {
    console.error('Ошибка при обработке изображения:', error);
    res.status(500).json({ message: 'Ошибка сервера при обработке файла' });
  }
});

// Получить все статьи
router.get('/articles', (req, res) => {
  const articles = readArticles();
  res.json(articles);
});

// Получить статью по slug
router.get('/articles/:slug', (req, res) => {
  const articles = readArticles();
  const article = articles.find(a => a.slug === req.params.slug);
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: 'Статья не найдена' });
  }
});


// --- АДМИНСКИЕ РОУТЫ ---

// Вход в админку
router.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    // В реальном приложении здесь будет генерация JWT токена
    res.json({ success: true, message: "Вход выполнен" });
  } else {
    res.status(401).json({ success: false, message: "Неверный пароль" });
  }
});

// Добавить новую статью
router.post('/admin/articles', (req, res) => {
  // Здесь нужна проверка "авторизации", для MVP опустим
  const articles = readArticles();

  const maxId = articles.reduce((max, article) => (article.id > max ? article.id : max), 0);

  // 2. Создаем новый ID, прибавляя 1 к максимальному
  const newId = maxId + 1;

  const newArticle = {
    id: newId,
    ...req.body
  };
  articles.push(newArticle);
  writeArticles(articles);
  res.status(201).json(newArticle);
});

// Обновить статью
router.get('/admin/articles/:id', (req, res) => {
  const articles = readArticles();
  // Используем `==` т.к. id из params - строка, а в JSON - число.
  const article = articles.find(a => a.id == req.params.id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ message: 'Статья не найдена' });
  }
});

// Обновить статью
router.put('/admin/articles/:id', (req, res) => { // Убедитесь, что здесь .put, а не .post или .get
  const articles = readArticles();
  const articleIndex = articles.findIndex(a => a.id == req.params.id);
  if (articleIndex !== -1) {
    articles[articleIndex] = { ...articles[articleIndex], ...req.body };
    writeArticles(articles);
    res.json(articles[articleIndex]);
  } else {
    res.status(404).json({ message: 'Статья не найдена для обновления' });
  }
});

// Удалить статью
router.delete('/admin/articles/:id', (req, res) => {
  let articles = readArticles();
  articles = articles.filter(a => a.id != req.params.id);
  writeArticles(articles);
  res.status(204).send(); // No Content
});


module.exports = router;