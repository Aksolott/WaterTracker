const SetWeight = require("./intents/SetWeight.intent");
const AddWater = require("./intents/AddWater.intent");
const GetStats = require("./intents/GetStats.intent");

const { getReminderMessage } = require("./services/notification");

function pushCheck(event) {

    const userId = event.userId || event.uuid;

    const message = getReminderMessage(userId);

    if (message) {
        return {
            text: message,
            end_session: false
        };
    }

    return null;
}

function index(event) {

    const userId = event.userId || event.uuid;
    const text = (event.text || "").toLowerCase().trim();

    const pushResponse = pushCheck(event);

    if (pushResponse) {
        return pushResponse;
    }

    if (
        text.includes("вес") ||
        text.includes("кг") ||
        text.includes("килограмм")
    ) {
        return SetWeight(event);
    }

    if (
        text.includes("добавь") ||
        text.includes("выпил") ||
        text.includes("вода") ||
        text.includes("стакан") ||
        text.includes("литр") ||
        text.includes("мл")
    ) {
        return AddWater(event);
    }

    if (
        text.includes("сколько") ||
        text.includes("осталось") ||
        text.includes("статистика") ||
        text.includes("прогресс")
    ) {
        return GetStats(event);
    }

    return {
        text: `💧 Я помогу тебе следить за водой:

— скажи "мой вес 70"
— скажи "добавь стакан воды"
— скажи "сколько осталось"`,
        end_session: false
    };
}

module.exports = {
    index
};
