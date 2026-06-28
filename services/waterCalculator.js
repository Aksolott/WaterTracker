const WATER_PER_KG = 30;
function calculateDailyNorm(weight) {
    return weight * WATER_PER_KG;
}

module.exports = {
    calculateDailyNorm
};