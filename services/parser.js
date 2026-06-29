function parseWater(text) {
    text = text.toLowerCase();

    if (text.includes("пол литра") || text.includes("пол-литра")) {
        return 500;
    }

    if (text.includes("литр")) {
        return 1000;
    }

    const mlMatch = text.match(/(\d+)\s*(мл|миллилитр)/);

    if (mlMatch) {
        return parseInt(mlMatch[1]);
    }

    if (text.includes("два стакана")) {
        return 600;
    }

    if (text.includes("стакан")) {
        return 300;
    }

    return 0;
}

module.exports = {
    parseWater
};