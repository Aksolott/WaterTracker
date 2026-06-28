const { getStats } = require("../services/storage");

function GetStats(event) {

    const userId = event.userId || event.uuid;

    const stats = getStats(userId);

    return {
        text: `Твой прогресс:

Выпито: ${stats.waterToday} мл
Норма: ${stats.dailyNorm} мл
Осталось: ${stats.remaining} мл`,
        end_session: false
    };
}

module.exports = GetStats;
