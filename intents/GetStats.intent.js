const { getStats } = require("../services/storage");

function GetStats(event) {

    const stats = getStats(event.userId);

    if (stats.dailyNorm === 0) {

        return {

            text:
                "Я пока не знаю твой вес.\n\nСкажи:\n\nмой вес 70 кг",

            end_session: false

        };

    }

    const percent = Math.round(
        (stats.waterToday / stats.dailyNorm) * 100
    );

    return {

        text:
            `📊 Твой прогресс

💧 Выпито: ${stats.waterToday} мл

🎯 Норма: ${stats.dailyNorm} мл

📉 Осталось: ${stats.remaining} мл

📈 Выполнено: ${percent}%`,

        end_session: false

    };

}

module.exports = GetStats;