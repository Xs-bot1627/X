module.exports.config = {
  name: "chidori",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
  description: "Ship you and your tagged person on Chidori template",
  commandCategory: "Love",
  usages: "[tag]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "path": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];

  const dirMaterial = resolve(__dirname, 'cache', 'canvas');
  if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
  // Place chidori.jpg in this folder manually
};

async function makeImage({ senderID, mentionedID }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];

  const __root = path.resolve(__dirname, "cache", "canvas");
  const baseImage = await jimp.read(path.resolve(__root, "chidori.jpg"));

  let pathImg = __root + `/chidori_${senderID}_${mentionedID}.png`;

  let avatarSenderPath = __root + `/avt_${senderID}.png`;
  let avatarMentionedPath = __root + `/avt_${mentionedID}.png`;

  // 🔑 Facebook default app token
  const fbToken = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";

  // Download sender avatar
  let getAvatarSender = (await axios.get(
    `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=${fbToken}`,
    { responseType: "arraybuffer" }
  )).data;
  fs.writeFileSync(avatarSenderPath, Buffer.from(getAvatarSender, "binary"));

  // Download mentioned avatar
  let getAvatarMentioned = (await axios.get(
    `https://graph.facebook.com/${mentionedID}/picture?width=512&height=512&access_token=${fbToken}`,
    { responseType: "arraybuffer" }
  )).data;
  fs.writeFileSync(avatarMentionedPath, Buffer.from(getAvatarMentioned, "binary"));

  // Make avatars circular
  let circleAvatarSender = await jimp.read(await circle(avatarSenderPath));
  let circleAvatarMentioned = await jimp.read(await circle(avatarMentionedPath));

  // Composite avatars on template
  baseImage.resize(1024, 712)
    .composite(circleAvatarMentioned.resize(120, 120), 390, 230) // Rin’s face
    .composite(circleAvatarSender.resize(120, 120), 570, 160);   // Kakashi’s face

  // Save final image
  let raw = await baseImage.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);

  // Cleanup
  fs.unlinkSync(avatarSenderPath);
  fs.unlinkSync(avatarMentionedPath);

  return pathImg;
}

async function circle(imagePath) {
  const jimp = require("jimp");
  let image = await jimp.read(imagePath);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api }) {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID, mentions } = event;

  if (!Object.keys(mentions).length) {
    return api.sendMessage("⚡ Vui lòng tag 1 người để ship!", threadID, messageID);
  }

  let mentionedID = Object.keys(mentions)[0];
  let tagName = mentions[mentionedID].replace("@", "");

  return makeImage({ senderID, mentionedID }).then(path => {
    return api.sendMessage({
      body: `⚡ ${tagName} bị bạn dính Chidori 😳`,
      mentions: [{ tag: tagName, id: mentionedID }],
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  });
};
