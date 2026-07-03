const WATER_PER_KG = 30;

function calculateDailyNorm(weight) {

    return Math.round(weight * WATER_PER_KG);

}

module.exports = {
    calculateDailyNorm
};