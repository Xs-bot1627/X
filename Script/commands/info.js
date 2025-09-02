const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
  name: "info",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Shaon Ahmed (Modified by Joy)",
  description: "Show full bot information",
  commandCategory: "info",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, Threads }) {
  const timeNow = moment().tz("Asia/Dhaka");
  const formattedTime = timeNow.format("DD/MM/YYYY hh:mm:ss A");

  const { commands } = global.client;
  const { config } = global;
  const { PREFIX, BOTNAME } = config;
  const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
  const customPrefix = threadSetting.PREFIX || PREFIX;

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const sendInfo = () => api.sendMessage({
    body:
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃     🤖 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 𝗦𝗬𝗦𝗧𝗘𝗠     
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🛠️ 𝗕𝗼𝘁 𝗡𝗮𝗺𝗲   : ${BOTNAME}
┃ 📌 𝗚𝗹𝗼𝗯𝗮𝗹 𝗣𝗿𝗲𝗳𝗶𝘅 : ${PREFIX}
┃ 💬 𝗕𝗼𝘅 𝗣𝗿𝗲𝗳𝗶𝘅    : ${customPrefix}
┃ 📦 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${commands.size}
┃ 🧠 𝗨𝗽𝘁𝗶𝗺𝗲         : ${hours}h ${minutes}m ${seconds}s
┃ 👥 𝗧𝗼𝘁𝗮𝗹 𝗨𝘀𝗲𝗿𝘀   : ${global.data.allUserID.length}
┃ 👨‍👩‍👧‍👦 𝗧𝗼𝘁𝗮𝗹 𝗚𝗿𝗼𝘂𝗽𝘀  : ${global.data.allThreadID.length}
┃ 🛰️ 𝗣𝗶𝗻𝗴           : ${Date.now() - timeNow.valueOf()}ms
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🕒 𝗧𝗶𝗺𝗲 : ${formattedTime}
┗━━━━━━━━━━━━━━━━━━━━━┛
Thanks for using ${BOTNAME}!`,
    attachment: fs.createReadStream(__dirname + "/cache/info_img.png")
  }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/info_img.png"));

  // Replace with your preferred UID or image
  const imageUrl = "https://graph.facebook.com/100087098984822/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  return request(encodeURI(imageUrl))
    .pipe(fs.createWriteStream(__dirname + "/cache/info_img.png"))
    .on("close", () => sendInfo());
};