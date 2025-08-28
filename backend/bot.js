require('dotenv').config(); // Эта строчка должна быть САМОЙ ПЕРВОЙ!
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Эта функция срабатывает на ЛЮБОЕ сообщение, отправленное боту
bot.on('message', (msg) => {
  const userId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
  const text = msg.text;

  console.log(`Получено сообщение от ${username} (ID: ${userId}): ${text}`);

  // Формируем красивое сообщение для пересылки в ваш канал
  const forwardMessage = `
    New Question from: ${username}
    User ID: ${userId}
    --------------------
    ${text}
  `;

  // Пересылаем сообщение в ваш приватный канал
  bot.sendMessage(CHAT_ID, forwardMessage);

  // (Опционально) Отвечаем пользователю, что его вопрос получен
  bot.sendMessage(userId, 'Спасибо! Ваш вопрос получен, мы скоро ответим.');
});

console.log('Бот запущен...');