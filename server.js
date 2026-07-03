const express = require("express");
const cors = require('cors');

// Подключаем обработчик сообщений
const { handleMessage } = require("./handlers/messageHandler");

const app = express();

// Настройка CORS и парсинга JSON
app.use(cors());
app.use(express.json());

// --- КОРНЕВОЙ ПУТЬ (для проверки) ---
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "Сервер работает!"
    });
});

// --- ОСНОВНОЙ ВЕБХУК ДЛЯ СБЕР СТУДИО ---
app.post("/webhook", async (req, res) => {
    try {
        console.log("📩 Получен запрос от Студио:", JSON.stringify(req.body, null, 2));

        // Вызываем обработчик с данными от Студио
        const response = await handleMessage(req.body);

        // Проверяем, что ответ имеет правильный формат
        if (!response || typeof response !== 'object') {
            throw new Error('Обработчик вернул некорректный ответ');
        }

        // Если нет поля type — добавляем text по умолчанию
        if (!response.type) {
            response.type = 'text';
        }

        console.log("📤 Ответ бота:", JSON.stringify(response, null, 2));
        res.json(response);

    } catch (error) {
        console.error("❌ Ошибка в webhook:", error);

        // Отправляем ошибку в правильном формате для Сбер Студио
        res.status(500).json({
            text: "Извините, произошла ошибка на сервере. Попробуйте позже.",
            type: "text"
        });
    }
});

// --- ДОПОЛНИТЕЛЬНО: GET-запрос для проверки ---
app.get("/webhook", (req, res) => {
    res.json({
        status: "ok",
        message: "Webhook доступен. Используйте POST-запросы для работы с ботом.",
        example: {
            method: "POST",
            url: "https://watertracker-44pv.onrender.com/webhook",
            body: {
                message: "Привет!",
                user: { id: "user123" }
            }
        }
    });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`📌 Webhook URL: https://watertracker-44pv.onrender.com/webhook`);
});