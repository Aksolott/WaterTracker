const { calculateDailyNorm } = require("../services/waterCalculator");
const { setWeight } = require("../services/storage");

function SetWeight(event) {

    const text = (event.text || "").toLowerCase();

    const userId = event.userId;

    const match = text.match(/\d+/);

    if (!match) {

        return {
            text: "Укажи вес, например: мой вес 70 кг.",
            end_session: false
        };

    }

    const weight = parseInt(match[0]);

    if (weight < 20 || weight > 300) {

        return {
            text: "Укажи корректный вес от 20 до 300 кг.",
            end_session: false
        };

    }

    const norm = calculateDailyNorm(weight);

    setWeight(userId, weight, norm);

    return {
        text: "Ваш вес сохранён! 🎉",
        type: "text"
    };
}

module.exports = SetWeight;
