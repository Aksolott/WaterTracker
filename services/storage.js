function parseWater(text) {

    text = text.toLowerCase();

    if (text.includes("пол литра") || text.includes("пол-литра")) {
        return 500;
    }

    if (text.includes("литр")) {
        return 1000;
    }

    if (text.includes("два стакана")) {
        return 600;
    }

    if (text.includes("стакан")) {
        return 300;
    }

    const match = text.match(/(\d+)\s*(мл|миллилитр)/);

    if (match) {
        return parseInt(match[1]);
    }

    return 0;

}

module.exports = {
    parseWater
};