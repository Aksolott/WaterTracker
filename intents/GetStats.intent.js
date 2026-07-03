const { getStats } = require("../services/storage");

function GetStats(event) {
    const { userId } = event;

    const stats = getStats(userId);

    if (!stats || stats.dailyNorm === 0) {
        return {
            text: "❌ Вы ещё не указали свой вес.\nПожалуйста, начните с команды: \"мой вес 70 кг\"",
            type: "text"
        };
    }

    const progress = Math.round((stats.drunk / stats.dailyNorm) * 100);

    const barLength = 10;
    const filled = Math.round((progress / 100) * barLength);
    const empty = barLength - filled;
    const progressBar = '█'.repeat(filled) + '░'.repeat(empty);

    return {
        text: `📊 ВАША СТАТИСТИКА:\n\n${progressBar} ${progress}%\n\n💧 Выпито: ${stats.drunk} мл\n🎯 Норма: ${stats.dailyNorm} мл\n⏳ Осталось: ${stats.remaining} мл\n\n${stats.remaining <= 0 ? '🎉 Отлично! Норма выполнена!' : 'Продолжайте пить воду! 💪'}`,
        type: "text"
    };
}

module.exports = GetStats;