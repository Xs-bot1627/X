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
  // Make sure chidori.jpg is already placed here manually
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

  // Download avatars in binary
  let getAvatarSender = (await axios.get(
    `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    { responseType: "arraybuffer" }
  )).data;
  fs.writeFileSync(avatarSenderPath, Buffer.from(getAvatarSender, "binary"));

  let getAvatarMentioned = (await axios.get(
    `https://graph.facebook.com/${mentionedID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
    { responseType: "arraybuffer" }
  )).data;
  fs.writeFileSync(avatarMentionedPath, Buffer.from(getAvatarMentioned, "binary"));

  // Make avatars circular
  let circleAvatarSender = await jimp.read(await circle(avatarSenderPath));
  let circleAvatarMentioned = await jimp.read(await circle(avatarMentionedPath));

  // Composite avatars onto Chidori template
  baseImage.resize(1024, 712)
    .composite(circleAvatarMentioned.resize(200, 200), 389, 407) // Left: tagged
    .composite(circleAvatarSender.resize(200, 200), 527, 141);    // Right: sender

  // Save final image
  let raw = await baseImage.getBufferAsync("image/png");
  fs.writeFileSync(pathImg, raw);

  // Remove temp avatar files
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
    return api.sendMessage("Vui lòng tag 1 người để ship!", threadID, messageID);
  }

  let mentionedID = Object.keys(mentions)[0];
  let tagName = mentions[mentionedID].replace("@", "");

  return makeImage({ senderID, mentionedID }).then(path => {
    return api.sendMessage({
      body: "Ship 💕",
      mentions: [{ tag: tagName, id: mentionedID }],
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  });
};
