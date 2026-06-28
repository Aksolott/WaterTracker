const { parseWater } = require("../services/parser");
const { addWater, getStats } = require("../services/storage");

function AddWater(event) {

    const text = (event.text || "").toLowerCase();
    const userId = event.userId || event.uuid;

    const amount = parseWater(text);

    if (!amount) {
        return {
            text: "Не понял количество воды. Например: 200 мл или стакан",
            end_session: false
        };
    }

    addWater(userId, amount);

    const stats = getStats(userId);

    return {
        text: `Добавлено ${amount} мл 

Сегодня: ${stats.waterToday} / ${stats.dailyNorm} мл
Осталось: ${stats.remaining} мл`,
        end_session: false
    };
}

module.exports = AddWater;
