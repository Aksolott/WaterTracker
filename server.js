const express = require("express");
const { handleMessage } = require("./handlers/messageHandler");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.post("/", (req, res) => {

    try {

        const response = handleMessage(req.body);

        res.json(response);

    } catch (e) {

        console.error(e);

        res.status(500).json({
            message: {
                text: "Ошибка сервера"
            }
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server started on ${PORT}`);

});