const SetWeight = require("../intents/SetWeight.intent");
const AddWater = require("../intents/AddWater.intent");
const GetStats = require("../intents/GetStats.intent");
const { getReminderMessage } = require("../services/notification");

function normalizeEvent(body) {
    let text = "";
    let userId = "";

    // Локальное тестирование
    if (body.text) {
        text = body.text;
    }

    if (body.userId) {
        userId = body.userId;
    }

    // SmartAppAPI (Сбер Студио)
    if (!text && body.message) {
        text =
            body.message.original_text ||
            body.message.text ||
            "";
    }

    if (!text && body.request) {
        text =
            body.request.original_utterance ||
            "";
    }

    if (!userId) {
        userId =
            body.uuid ||
            body.user_id ||
            body.session?.user?.user_id ||
            body.session?.user_id ||
            "demo-user";
    }

    return {
        userId,
        text: text.trim()
    };
}

// ✅ ИСПРАВЛЕНО: возвращаем правильный формат для Сбер Студио
function createResponse(result) {
    // Если result уже содержит text и type — возвращаем как есть
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

    // Если result — просто строка
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

// ✅ ИСПРАВЛЕНО: основной обработчик теперь возвращает правильный формат
function handleMessage(body) {
    try {
        console.log("📨 Обработка сообщения:", JSON.stringify(body, null, 2));

        const event = normalizeEvent(body);
        console.log(`👤 Пользователь: ${event.userId}, Текст: "${event.text}"`);

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
            // Приветственное сообщение
            return {
                text: `💧 Привет! Я помогу следить за водным балансом.\n\nПопробуй сказать:\n• мой вес 70 кг\n• добавь стакан воды\n• добавь 500 мл\n• сколько осталось`,
                type: "text"
            };
        }

        // Преобразуем результат в правильный формат
        return createResponse(result);

    } catch (error) {
        console.error("❌ Ошибка в handleMessage:", error);
        return {
            text: "Произошла ошибка при обработке запроса. Попробуйте ещё раз.",
            type: "text"
        };
    }
}

module.exports = {
    handleMessage
};