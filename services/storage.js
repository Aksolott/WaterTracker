const users = {};
function getUser(userId) {
    if (!users[userId]) {

        users[userId] = {
            weight: 0,
            dailyNorm: 0,
            waterToday: 0,
            lastUpdate: new Date().toDateString()
        };
    }

    return users[userId];
}
function setWeight(userId, weight, norm) {

    const user = getUser(userId);

    user.weight = weight;
    user.dailyNorm = norm;
}
function addWater(userId, amount) {

    const user = getUser(userId);

    checkNewDay(user);

    user.waterToday += amount;
}

function getStats(userId) {

    const user = getUser(UserId);

    checkNewDay(user);

    return {
        weight: user.weight,
        dailyNorm: user.dailyNorm,
        waterToday: user.waterToday,
        remaining: Math.max(0, user.dailyNorm - user.waterToday)
    };
}
function checkNewDay(user) {
    const today = new Date().toDateString();

    if (today !== user.lastUpdate) {
        user.waterToday = 0;
        user.lastUpdate = today;
    }
}

module.exports = {
    setWeight,
    addWater,
    getStats
};