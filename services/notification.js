const { getStats } = require("./storage");

const REMINDERS = [
    { hour: 9, text: "💧 Утро — самое время выпить стакан воды!" },
    { hour: 12, text: "💧 Обед: не забудь про воду!" },
    { hour: 16, text: "💧 Поддержи водный баланс!" },
    { hour: 20, text: "💧 Вечер: добери норму воды!" }
];

function getReminderMessage(userId) {

    const stats = getStats(userId);

    if (stats.remaining <= 0) {
        return "🎉 Отлично! Ты уже выпил свою норму воды за сегодня!";
    }

    const hour = new Date().getHours();

    const reminder = REMINDERS.find(r => r.hour === hour);

    if (reminder) {
        return `${reminder.text}

Осталось: ${stats.remaining} мл 💧`;
    }

    return null;
}

module.exports = {
    getReminderMessage
};
