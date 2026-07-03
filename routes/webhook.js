const express = require('express');
const router = express.Router();

// Подключаем все обработчики команд
const startHandler = require('../handlers/start');
const addWaterHandler = require('../handlers/addWater');
const weightHandler = require('../handlers/weight');
const messageHandler = require('../handlers/messageHandler');

// --- ОСНОВНОЙ ОБРАБОТЧИК ДЛЯ СБЕР СТУДИО (POST) ---
router.post('/', async (req, res) => {
    try {
        console.log('📩 Получен запрос от Сбер Студио:', JSON.stringify(req.body, null, 2));

        const { intent, payload, message, user } = req.body;

        // Определяем, какой обработчик вызвать
        let response = null;

        // 1. Если пришло намерение (intent) — используем его
        if (intent) {
            switch (intent) {
                case 'start':
                    response = await startHandler(payload || { user });
                    break;
                case 'AddWater':
                    response = await addWaterHandler(payload || { user, message });
                    break;
                case 'SetWeight':
                    response = await weightHandler(payload || { user, message });
                    break;
                default:
                    // Если намерение не распознано — передаём в общий обработчик
                    response = await messageHandler({ user, message, intent });
            }
        }
        // 2. Если нет intent, но есть message — используем общий обработчик
        else if (message) {
            response = await messageHandler({ user, message });
        }
        // 3. Если ничего нет — ответ по умолчанию
        else {
            response = {
                text: 'Привет! Я бот для отслеживания воды. Напиши "старт" или "помощь", чтобы начать.',
                type: 'text'
            };
        }

        // Проверяем, что ответ имеет правильный формат
        if (!response || typeof response !== 'object') {
            response = {
                text: 'Извините, я не смог обработать ваш запрос. Попробуйте ещё раз.',
                type: 'text'
            };
        }

        // Если в ответе нет type — добавляем text по умолчанию
        if (!response.type) {
            response.type = 'text';
        }

        console.log('📤 Ответ от бота:', JSON.stringify(response, null, 2));
        res.json(response);

    } catch (error) {
        console.error('❌ Ошибка в webhook:', error);
        res.status(500).json({
            text: 'Произошла ошибка на сервере. Попробуйте позже.',
            type: 'text'
        });
    }
});

// --- ДЛЯ ПРОВЕРКИ В БРАУЗЕРЕ (GET) ---
router.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Webhook работает! Используйте POST-запросы для взаимодействия с ботом.',
        endpoints: {
            post: '/webhook - основной эндпоинт для Сбер Студио',
            get: '/webhook - проверка работоспособности'
        }
    });
});

module.exports = router;