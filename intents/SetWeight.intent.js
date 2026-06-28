const { calculateDailyNorm } = require("../services/waterCalculator");
const { setWeight } = require("../services/storage");

function SetWeight(event) {

    const text = (event.text || "").toLowerCase();
    const userId = event.userId || event.uuid;

    const match = text.match(/\d+/);

    if (!match) {
        return {
            text: "Укажи вес, например: 70 кг",
            end_session: false
        };
    }

    const weight = parseInt(match[0]);
    const norm = calculateDailyNorm(weight);

    setWeight(userId, weight, norm);

    return {
        text: `Вес сохранён: ${weight} кг. Норма воды: ${norm} мл`,
        end_session: false
    };
}

module.exports = SetWeight;
