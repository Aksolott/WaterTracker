const { parseWater } = require("../services/parser");
const { addWater, getStats } = require("../services/storage");

function AddWater(event) {

    const userId = event.userId;

    const text = (event.text || "").toLowerCase();

    const stats = getStats(userId);

    if (stats.dailyNorm === 0) {

        return {

            text:
                "Сначала сообщи свой вес.\n\nНапример:\n\nмой вес 70 кг",

            end_session: false

        };

    }

    const amount = parseWater(text);

    if (!amount) {

        return {

            text:
                "Не удалось определить количество воды.\n\nНапример:\n• добавь 250 мл\n• добавь стакан воды",

            end_session: false

        };

    }

    addWater(userId, amount);

    const newStats = getStats(userId);

    let answer =
        `💧 Добавлено ${amount} мл.

Сегодня выпито:

${newStats.waterToday} из ${newStats.dailyNorm} мл.

Осталось:

${newStats.remaining} мл.`;

    if (newStats.remaining === 0) {

        answer += "\n\n🎉 Поздравляю! Сегодня ты выполнил дневную норму.";

    }

    return {

        text: answer,
        end_session: false

    };

}

module.exports = AddWater;
