// // require('dotenv').config(); // Эта строчка должна быть САМОЙ ПЕРВОЙ!
// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '.env') });
// const TelegramBot = require('node-telegram-bot-api');

// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// const bot = new TelegramBot(BOT_TOKEN, { 
//     polling: true, request: {
//     family: 4, // Принудительно использовать IPv4
// }, });

// // Эта функция срабатывает на ЛЮБОЕ сообщение, отправленное боту
// bot.on('message', (msg) => {
//   const userId = msg.from.id;
//   const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
//   const text = msg.text;

//   console.log(`Получено сообщение от ${username} (ID: ${userId}): ${text}`);

//   // Формируем красивое сообщение для пересылки в ваш канал
// //   User ID: ${userId}
//   const forwardMessage = `
//     Задали новый вопрос, пользователь: ${username}
//     --------------------
//     Текст вопроса: ${text}
//   `;

//   // Пересылаем сообщение в ваш приватный канал
//   bot.sendMessage(CHAT_ID, forwardMessage);

//   // (Опционально) Отвечаем пользователю, что его вопрос получен
//   bot.sendMessage(userId, 'Здравствуйте! Спасибо! Ваш вопрос получен, мы скоро ответим.');
// });

// console.log('Бот запущен...');
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
// ВАЖНО: Добавьте ваш личный User ID для безопасности
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

if (!BOT_TOKEN || !CHAT_ID || !ADMIN_USER_ID) {
    console.error('Ошибка: Необходимые переменные (TOKEN, CHAT_ID, ADMIN_USER_ID) не найдены в .env файле!');
    process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, {
    polling: true,
    request: {
        family: 4,
    },
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;

    // СЦЕНАРИЙ 1: Сообщение пришло от АДМИНА в приватном канале И это ОТВЕТ
    if (chatId.toString() === CHAT_ID && msg.reply_to_message && fromId.toString() === ADMIN_USER_ID) {

        // Пытаемся извлечь ID пользователя из оригинального сообщения
        const originalMessageText = msg.reply_to_message.text;
        const match = originalMessageText.match(/User ID: (\d+)/);

        if (match && match[1]) {
            const targetUserId = match[1];
            const replyText = msg.text;

            bot.sendMessage(targetUserId, replyText)
                .then(() => {
                    console.log(`Ответ успешно отправлен пользователю ${targetUserId}`);
                    // (Опционально) Сообщаем админу, что все ок
                    bot.sendMessage(CHAT_ID, '✅ Ответ отправлен пользователю.');
                })
                .catch(error => {
                    console.error(`Ошибка отправки ответа пользователю ${targetUserId}:`, error.message);
                    bot.sendMessage(CHAT_ID, `❌ Не удалось отправить ответ. Возможно, пользователь заблокировал бота.`);
                });
        } else {
            console.log('Не удалось извлечь User ID из сообщения, на которое отвечали.');
        }

        // СЦЕНАРИЙ 2: Сообщение пришло от обычного ПОЛЬЗОВАТЕЛЯ (не из админского чата)
    } else if (chatId.toString() !== CHAT_ID) {
        const userId = msg.from.id;
        const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
        const text = msg.text;

        console.log(`Получено сообщение от ${username} (ID: ${userId}): ${text}`);

        // Важно оставлять User ID в сообщении, чтобы на него можно было ответить!
        const forwardMessage = `
Задали новый вопрос, пользователь: ${username}
User ID: ${userId} 
--------------------
Текст вопроса: ${text}
        `;

        bot.sendMessage(CHAT_ID, forwardMessage);
        bot.sendMessage(userId, 'Здравствуйте! Спасибо! Ваш вопрос получен, мы скоро ответим.');
    }
});

console.log('Бот запущен...');