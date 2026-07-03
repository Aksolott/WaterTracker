const { addWater } = require("../models/users");
const { getStats } = require("../services/storage");

function AddWater(event) {
    const { userId, text } = event;

    // Определяем объём воды
    let amount = 0;
    let unit = 'мл';

    // Проверяем разные варианты
    const mlMatch = text.match(/(\d+)\s*мл/);
    const literMatch = text.match(/(\d+)\s*литр/);
    const glassMatch = text.match(/стакан/);

    if (mlMatch) {
        amount = parseInt(mlMatch[1]);
    } else if (literMatch) {
        amount = parseInt(literMatch[1]) * 1000;
    } else if (glassMatch) {
        amount = 200; // стандартный стакан 200 мл
    } else {
        // Если не указан объём — добавляем стакан по умолчанию
        amount = 200;
    }

    if (amount <= 0 || amount > 5000) {
        return {
            text: "❌ Пожалуйста, укажите корректный объём (до 5000 мл).",
            type: "text"
        };
    }

    // Сохраняем воду
    addWater(userId, amount);

    // Получаем актуальную статистику
    const stats = getStats(userId);
    const progress = Math.round((stats.drunk / stats.dailyNorm) * 100);

    return {
        text: `✅ Добавлено ${amount} мл воды!\n💧 Всего выпито: ${stats.drunk} мл из ${stats.dailyNorm} мл (${progress}%)\nОсталось: ${stats.remaining} мл`,
        type: "text"
    };
}

module.exports = AddWater;