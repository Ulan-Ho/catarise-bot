import express from "express";
import TelegramBot from "node-telegram-bot-api";
import bodyParser from "body-parser";

// Замените 'YOUR_BOT_TOKEN' на токен вашего бота
const token = process.env.my_testing_bot_token;
const bot = new TelegramBot(token);

// Функция для обработки входящих сообщений
function handleMessage(msg) {
  if (msg.text && msg.text.toLowerCase() === 'я пришел') {
    // Пользователь отправил сообщение "Я пришел"
    const userId = msg.from.id;
    const message = 'Пользователь пришел!'; // Сообщение, которое будет отправлено в личку администратору
    // Замените 'ADMIN_USER_ID' на id администратора
    const adminUserId = 957446580;
    bot.sendMessage(adminUserId, message); // Отправляем сообщение в личку администратору
  }
}

// Создаем приложение Express
const app = express();

// Парсинг JSON-тела для POST-запросов
app.use(bodyParser.json());

// Обработка POST-запросов на /webhook
app.post('/webhook', (req, res) => {
  const msg = req.body; // Получаем сообщение из запроса
  handleMessage(msg); // Обрабатываем сообщение
  res.sendStatus(200);
});

// Запуск сервера на порте 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
