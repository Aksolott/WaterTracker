const { getStats } = require("./storage");

const reminders = [
    {
        hour: 9,
        text: "💧 Доброе утро! Самое время выпить стакан воды."
    },
    {
        hour: 12,
        text: "💧 Обеденное время. Не забудь попить воды."
    },
    {
        hour: 16,
        text: "💧 Поддерживай водный баланс."
    },
    {
        hour: 20,
        text: "💧 Вечер. Попробуй добрать дневную норму."
    }
];

function getReminderMessage(userId) {

    const stats = getStats(userId);

    if (stats.dailyNorm === 0) {
        return null;
    }

    if (stats.remaining <= 0) {
        return "🎉 Отлично! Сегодня ты уже выполнил норму воды.";
    }

    const hour = new Date().getHours();

    const reminder = reminders.find(r => r.hour === hour);

    if (!reminder) {
        return null;
    }

    return `${reminder.text}

Осталось выпить ${stats.remaining} мл 💧`;

}

module.exports = {
    getReminderMessage
};