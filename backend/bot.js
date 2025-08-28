const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

if (!BOT_TOKEN || !CHAT_ID || !ADMIN_USER_ID) {
    console.error('Ошибка: Переменные (TOKEN, CHAT_ID, ADMIN_USER_ID) не найдены в .env!');
    process.exit(1);
}

const bot = new TelegramBot(BOT_TOKEN, {
    polling: true,
    request: { family: 4 },
});

// --- НОВЫЙ ОБРАБОТЧИК ОШИБОК ---
// Он будет ловить любые проблемы со связью с серверами Telegram
bot.on('polling_error', (error) => {
    console.log('--- POLLING ERROR ---');
    console.log(error.code);  // => 'EFATAL'
    console.log(error.message); // => Описание ошибки
    console.log('---------------------');
});

// --- МОДИФИЦИРОВАННЫЙ ОБРАБОТЧИК СООБЩЕНИЙ ---
bot.on('message', (msg) => {
    // Логируем ВЕСЬ объект сообщения в формате JSON
    console.log('--- ПОЛУЧЕН НОВЫЙ ОБЪЕКТ СООБЩЕНИЯ ---');
    console.log(JSON.stringify(msg, null, 2)); // Выводим красивый JSON
    console.log('------------------------------------');

    const chatId = msg.chat.id;
    const fromId = msg.from.id;

    // Сценарий 1: Ответ от админа в приватном канале
    if (chatId.toString() === CHAT_ID && msg.reply_to_message && fromId.toString() === ADMIN_USER_ID) {
        console.log('>>> Условие 1 (ОТВЕТ АДМИНА) ВЫПОЛНЕНО <<<');
        const originalMessageText = msg.reply_to_message.text;
        const match = originalMessageText.match(/User ID: (\d+)/);

        if (match && match[1]) {
            const targetUserId = match[1];
            const replyText = msg.text;
            console.log(`>>> Пытаюсь отправить ответ "${replyText}" пользователю ${targetUserId} <<<`);
            bot.sendMessage(targetUserId, replyText);
        } else {
             console.log('>>> НЕ УДАЛОСЬ извлечь User ID из сообщения! <<<');
        }

    // Сценарий 2: Сообщение от пользователя
    } else if (chatId.toString() !== CHAT_ID) {
        console.log('>>> Условие 2 (СООБЩЕНИЕ ПОЛЬЗОВАТЕЛЯ) ВЫПОЛНЕНО <<<');
        const userId = msg.from.id;
        const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
        const text = msg.text;

        const forwardMessage = `\nЗадали новый вопрос, пользователь: ${username}\nUser ID: ${userId} \n--------------------\nТекст вопроса: ${text}`;
        
        bot.sendMessage(CHAT_ID, forwardMessage);
        bot.sendMessage(userId, 'Здравствуйте! Спасибо! Ваш вопрос получен, мы скоро ответим.');
    } else {
        // Сюда попадут все остальные сообщения в приватном канале (не-ответы)
        console.log('>>> Сообщение в приватном канале ПРОИГНОРИРОВАНО (не является ответом от админа) <<<');
    }
});

console.log('Бот запущен и готов к работе...');




// const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '.env') });
// const TelegramBot = require('node-telegram-bot-api');

// const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
// // ВАЖНО: Добавьте ваш личный User ID для безопасности
// const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

// if (!BOT_TOKEN || !CHAT_ID || !ADMIN_USER_ID) {
//     console.error('Ошибка: Необходимые переменные (TOKEN, CHAT_ID, ADMIN_USER_ID) не найдены в .env файле!');
//     process.exit(1);
// }

// const bot = new TelegramBot(BOT_TOKEN, {
//     polling: true,
//     request: {
//         family: 4,
//     },
// });

// bot.on('message', (msg) => {
//     const chatId = msg.chat.id;
//     const fromId = msg.from.id;

//     // --- ВРЕМЕННЫЙ БЛОК ДЛЯ ОТЛАДКИ ---
//     console.log('---------------------------------');
//     console.log('ПОЛУЧЕНО НОВОЕ СООБЩЕНИЕ');
//     console.log(`ID чата, откуда пришло: ${chatId}`);
//     console.log(`ID чата из .env:          ${CHAT_ID}`);
//     console.log(`ID отправителя:           ${fromId}`);
//     console.log(`ID админа из .env:        ${ADMIN_USER_ID}`);
//     console.log(`Это ответ?                ${!!msg.reply_to_message}`);
//     console.log('---------------------------------');
//     // --- КОНЕЦ БЛОКА ДЛЯ ОТЛАДКИ ---

//     // СЦЕНАРИЙ 1: Сообщение пришло от АДМИНА в приватном канале И это ОТВЕТ
//     if (chatId.toString() === CHAT_ID && msg.reply_to_message && fromId.toString() === ADMIN_USER_ID) {

//         // Пытаемся извлечь ID пользователя из оригинального сообщения
//         const originalMessageText = msg.reply_to_message.text;
//         const match = originalMessageText.match(/User ID: (\d+)/);

//         if (match && match[1]) {
//             const targetUserId = match[1];
//             const replyText = msg.text;

//             bot.sendMessage(targetUserId, replyText)
//                 .then(() => {
//                     console.log(`Ответ успешно отправлен пользователю ${targetUserId}`);
//                     // (Опционально) Сообщаем админу, что все ок
//                     bot.sendMessage(CHAT_ID, '✅ Ответ отправлен пользователю.');
//                 })
//                 .catch(error => {
//                     console.error(`Ошибка отправки ответа пользователю ${targetUserId}:`, error.message);
//                     bot.sendMessage(CHAT_ID, `❌ Не удалось отправить ответ. Возможно, пользователь заблокировал бота.`);
//                 });
//         } else {
//             console.log('Не удалось извлечь User ID из сообщения, на которое отвечали.');
//         }

//         // СЦЕНАРИЙ 2: Сообщение пришло от обычного ПОЛЬЗОВАТЕЛЯ (не из админского чата)
//     } else if (chatId.toString() !== CHAT_ID) {
//         const userId = msg.from.id;
//         const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
//         const text = msg.text;

//         console.log(`Получено сообщение от ${username} (ID: ${userId}): ${text}`);

//         // Важно оставлять User ID в сообщении, чтобы на него можно было ответить!
//         const forwardMessage = `
// Задали новый вопрос, пользователь: ${username}
// User ID: ${userId} 
// --------------------
// Текст вопроса: ${text}
//         `;

//         bot.sendMessage(CHAT_ID, forwardMessage);
//         bot.sendMessage(userId, 'Здравствуйте! Спасибо! Ваш вопрос получен, мы скоро ответим.');
//     }
// });

// console.log('Бот запущен...');