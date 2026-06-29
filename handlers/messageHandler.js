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

    // SmartAppAPI
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

function createResponse(result) {

    return {
        message: {
            text: result.text
        }
    };

}

function handleMessage(body) {

    const event = normalizeEvent(body);

    const text = event.text.toLowerCase();

    const reminder = getReminderMessage(event.userId);

    if (reminder) {

        return {
            message: {
                text: reminder
            }
        };

    }

    if (
        text.includes("вес") ||
        text.includes("килограмм") ||
        text.includes("кг")
    ) {

        return createResponse(SetWeight(event));

    }

    if (
        text.includes("добавь") ||
        text.includes("выпил") ||
        text.includes("вода") ||
        text.includes("стакан") ||
        text.includes("литр") ||
        text.includes("мл")
    ) {

        return createResponse(AddWater(event));

    }

    if (
        text.includes("статистика") ||
        text.includes("сколько") ||
        text.includes("осталось") ||
        text.includes("прогресс")
    ) {

        return createResponse(GetStats(event));

    }

    return {
        message: {
            text:
                `💧 Привет!

Я помогу следить за водным балансом.

Попробуй сказать:

• мой вес 70 кг

• добавь стакан воды

• добавь 500 мл

• сколько осталось`
        }
    };

}

module.exports = {
    handleMessage
};