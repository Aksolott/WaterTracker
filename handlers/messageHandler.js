const { calculateDailyNorm } = require("../services/waterCalculator");
const { parseWater } = require("../services/parser");
const { addWater, getStats, setWeight } = require("../services/storage");
function handleMessage(userId, text) {
    text = text.toLowerCase().trim();

    if (
        text.includes("вес") ||
        text.includes("килограмм") ||
        text.includes("кг")
    ) {

        const match = text.match(/\d+/);

        if (!match) {
            return 'Пожалуйста, укажить ваш вес в килограммах.'
        }

        const weight = parseInt(match[0]);

        const norm = calculateDailyNorm(weight);

        setWeight(userId, weight, norm);

        return `Замечательно! Ваш вес сохранен. Дневная норма воды составляет ${norm} мл воды.`
    }

    if (
        text.includes("добавь") ||
        text.includes("выпил")
    ) {

        const amount = parseWater(text);

        if (amount === 0) {
            return 'Не удалось определить количество воды.';
        }

        addWater(userId, amount);

        const stats = getStats(userId);

        return `Добавлено ${amount} мл. Сегодня выпито: ${stats.waterToday} из ${stats.dailyNorm} мл. Осталось ${stats.remaining} мл.`;
    }

        if (
            text.includes("статистика") ||
            text.includes("сколько") ||
            text.includes("осталось")
        ) {
            const stats = getStats(userId);

            return `Сегодня выпито ${stats.waterToday} мл. Норма ${stats.dailyNorm} мл. Осталось ${stats.remaining} мл.`;
        }

        return "Я пока понимаю команды только про вес, воду и статистику.";
}

module.exports = {
    handleMessage
};
