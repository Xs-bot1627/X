const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "info2",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Islamick Chat (Modified by Joy)",
  description: "Show Bot Info (Simple Clean)",
  commandCategory: "info",
  cooldowns: 1,
  dependencies: {
    request: '',
    "fs-extra": '',
    axios: ''
  }
};

module.exports.run = async function ({ api, event }) {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const currentTime = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

  const sendInfo = () => api.sendMessage({
    body:
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃     🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 ②     
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🛠️ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲   : ${global.config.BOTNAME}
┃ 📌 𝗣𝗿𝗲𝗳𝗶𝘅        : ${global.config.PREFIX}
┃ 👑 𝗢𝘄𝗻𝗲𝗿        : Joy
┃ 🕒 𝗧𝗶𝗺𝗲          : ${currentTime}
┃ 🧠 𝗨𝗽𝘁𝗶𝗺𝗲        : ${hours}h ${minutes}m ${seconds}s
┗━━━━━━━━━━━━━━━━━━━━━┛
Thanks for using ${global.config.BOTNAME}!`,
    attachment: fs.createReadStream(__dirname + "/cache/info2_img.png")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/info2_img.png"));

  // Use profile picture (same as admin.js format)
  const imgURL = "https://graph.facebook.com/100087098984822/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  return request(encodeURI(imgURL))
    .pipe(fs.createWriteStream(__dirname + "/cache/info2_img.png"))
    .on("close", () => sendInfo());
};