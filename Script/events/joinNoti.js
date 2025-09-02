const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas, registerFont } = require("canvas");
const jimp = require("jimp");
const moment = require("moment-timezone");

module.exports.config = {
  name: "joinBanner",
  eventType: ["log:subscribe"],
  version: "1.0.0",
  credits: "Jehad Joy + ChatGPT",
  description: "New member joins with custom banner from profile picture"
};

const FONT_URL = "https://drive.google.com/u/0/uc?id=1ZwFqYB-x6S9MjPfYm3t3SP1joohGl4iw&export=download";

module.exports.circle = async (image) => {
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
};

module.exports.run = async function({ api, event, Users }) {
  const threadID = event.threadID;
  const { logMessageData } = event;

  const threadInfo = await api.getThreadInfo(threadID);
  const threadName = threadInfo.threadName;
  const memberCount = threadInfo.participantIDs.length;

  if (logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) return;

  try {
    const fontDir = __dirname + `/cache/font`;
    if (!fs.existsSync(fontDir)) fs.mkdirSync(fontDir);
    if (!fs.existsSync(`${fontDir}/Semi.ttf`)) {
      const fontBuffer = (await axios.get(FONT_URL, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(`${fontDir}/Semi.ttf`, fontBuffer);
    }
    registerFont(`${fontDir}/Semi.ttf`, { family: "Semi" });

    for (let user of logMessageData.addedParticipants) {
      const name = user.fullName;
      const id = user.userFbId;

      const avatarURL = `https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatarBuffer = (await axios.get(avatarURL, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + `/cache/avt.png`, avatarBuffer);
      const avatarCircle = await this.circle(__dirname + `/cache/avt.png`);

      const bgList= [
        'https://raw.githubusercontent.com/Jehad2441139/imghost/main/bg4.jpg',
        'https://raw.githubusercontent.com/Jehad2441139/imghost/main/bg4.jpg',
        'https://raw.githubusercontent.com/Jehad2441139/imghost/main/bg4.jpg'
      ];

      const bgURL = bgList[Math.floor(Math.random() * bgList.length)];
      const bgBuffer = (await axios.get(bgURL, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(__dirname + `/cache/bg.png`, bgBuffer);

      const canvas = createCanvas(1902, 1082);
      const ctx = canvas.getContext("2d");

      const background = await loadImage(__dirname + `/cache/bg.png`);
      const avatar = await loadImage(avatarCircle);
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(avatar, canvas.width / 2 - 188, canvas.height / 2 - 370, 375, 375);

      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";

      ctx.font = "90px Semi";
      ctx.fillText(`Welcome ${name}`, canvas.width / 2, canvas.height / 2 + 100);

      ctx.font = "65px Semi";
      ctx.fillText(`You are now a member of ${threadName}`, canvas.width / 2, canvas.height / 2 + 200);
      ctx.fillText(`Total members: ${memberCount}`, canvas.width / 2, canvas.height / 2 + 280);

      const buffer = canvas.toBuffer();
      const imgPath = __dirname + `/cache/welcome_${id}.png`;
      fs.writeFileSync(imgPath, buffer);

      const nameAuthor = await Users.getNameUser(event.author);
      const time = moment.tz("Asia/Dhaka").format("hh:mm A - DD MMM YYYY");

      const msg = {
        body: `🌸 Hello ${name}!\n\nWelcome to the group ${threadName} 🥰\n➤ Added by: ${nameAuthor}\n➤ Join time: ${time}`,
        attachment: fs.createReadStream(imgPath),
        mentions: [{ tag: name, id }]
      };

      await api.sendMessage(msg, threadID);
      fs.unlinkSync(imgPath);
    }

    fs.unlinkSync(__dirname + `/cache/avt.png`);
    fs.unlinkSync(__dirname + `/cache/bg.png`);

  } catch (err) {
    console.error("❌ joinBanner ERROR:", err);
  }
};
