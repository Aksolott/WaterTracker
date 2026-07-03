const SetWeight = require("../intents/SetWeight.intent");
const AddWater = require("../intents/AddWater.intent");
const GetStats = require("../intents/GetStats.intent");
const { getReminderMessage } = require("../services/notification");

function normalizeEvent(body) {
    let text = "";
    let userId = "";

    // --- ИЗВЛЕКАЕМ ТЕКСТ ---
    // 1. Сначала проверяем поле message (Сбер Студио)
    if (body.message) {
        text = body.message.original_text || body.message.text || "";
    }
    
    // 2. Если нет в message — проверяем другие поля
    if (!text && body.text) {
        text = body.text;
    }
    
    // 3. Если нет — проверяем request (старый формат)
    if (!text && body.request) {
        text = body.request.original_utterance || body.request.text || "";
    }

    // --- ИЗВЛЕКАЕМ userId ---
    // 1. Из uuid (Сбер Студио)
    if (body.uuid) {
        userId = body.uuid.userId || body.uuid.sub || body.uuid;
    }
    
    // 2. Из session
    if (!userId && body.session) {
        userId = body.session.user?.user_id || body.session.user_id || body.session;
    }
    
    // 3. Из user
    if (!userId && body.user) {
        userId = body.user.id || body.user.user_id || body.user;
    }
    
    // 4. Из корневых полей
    if (!userId) {
        userId = body.user_id || body.userId || body.from?.id || "demo-user";
    }
    
    // Если userId — объект, превращаем его в строку
    if (typeof userId === 'object') {
        userId = userId.userId || userId.sub || userId.id || JSON.stringify(userId);
    }

    // --- ЛОГИРУЕМ ДЛЯ ОТЛАДКИ ---
    console.log(`🔍 Нормализация: userId=${userId}, text="${text}"`);

    return {
        userId: String(userId),
        text: text.trim()
    };
}

function createResponse(result) {
    // Если result содержит text — возвращаем как есть
    if (result && result.text) {
        return {
            text: result.text,
            type: result.type || "text"
        };
    }
    
    // Если result содержит message.text (старый формат)
    if (result && result.message && result.message.text) {
        return {
            text: result.message.text,
            type: "text"
        };
    }
    
    // Если result — строка
    if (typeof result === 'string') {
        return {
            text: result,
            type: "text"
        };
    }
    
    // Если ничего не подошло
    return {
        text: "Извините, я не смог обработать ваш запрос.",
        type: "text"
    };
}

function handleMessage(body) {
    try {
        console.log("📨 Обработка сообщения:", JSON.stringify(body, null, 2));
        
        const event = normalizeEvent(body);
        console.log(`👤 Пользователь: ${event.userId}, Текст: "${event.text}"`);

        // Если текст пустой — отвечаем приветствием
        if (!event.text) {
            return {
                text: `💧 Привет! Я помогу следить за водным балансом.\n\nПопробуй сказать:\n• мой вес 70 кг\n• добавь стакан воды\n• добавь 500 мл\n• сколько осталось`,
                type: "text"
            };
        }

        const text = event.text.toLowerCase();

        // Проверяем напоминание
        const reminder = getReminderMessage(event.userId);
        if (reminder) {
            return {
                text: reminder,
                type: "text"
            };
        }

        let result = null;

        // Определяем намерение
        if (
            text.includes("вес") ||
            text.includes("килограмм") ||
            text.includes("кг")
        ) {
            result = SetWeight(event);
        } else if (
            text.includes("добавь") ||
            text.includes("выпил") ||
            text.includes("вода") ||
            text.includes("стакан") ||
            text.includes("литр") ||
            text.includes("мл")
        ) {
            result = AddWater(event);
        } else if (
            text.includes("статистика") ||
            text.includes("сколько") ||
            text.includes("осталось") ||
            text.includes("прогресс")
        ) {
            result = GetStats(event);
        } else {
            // Приветственное сообщение для непонятных команд
            return {
                text: `💧 Я не понял команду.\n\nПопробуй сказать:\n• мой вес 70 кг\n• добавь стакан воды\n• добавь 500 мл\n• сколько осталось`,
                type: "text"
            };
        }

        // Преобразуем результат в правильный формат
        return createResponse(result);

    } catch (error) {
        console.error("❌ Ошибка в handleMessage:", error);
        console.error("📄 Стек ошибки:", error.stack);
        return {
            text: `Произошла ошибка при обработке запроса: ${error.message}`,
            type: "text"
        };
    }
}

module.exports = {
    handleMessage
};
