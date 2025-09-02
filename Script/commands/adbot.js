module.exports.config = {
    name: "ckbot",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
    description: "DESCRIPTION ABOUT BOT",
    commandCategory: "Media",
    usages: "",
    cooldowns: 4,
    dependencies: {
        "request": "",
        "fs": "",
        "moment-timezone": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const moment = global.nodemodule["moment-timezone"];
    const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    if (args.length == 0) return api.sendMessage(`You can use:\n\n${prefix}${this.config.name} user => it will take your own information.\n\n${prefix}${this.config.name} user @[Tag] => it will get friend information tag.\n\n${prefix}${this.config.name} box => it will get your box information.\n\n${prefix}${this.config.name} admin => Admin Bot's Personal Information`, event.threadID, event.messageID);

    if (args[0] == "admin") {
        const time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");
        const sendInfo = () => api.sendMessage({
            body:
`┏━━━━━━━━━━━━━━━━━━━━━┓
┃      🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟      
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 𝐍𝐚𝐦𝐞      : Joy
┃ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫    : Male
┃ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧  : Single
┃ 🎂 𝐀𝐠𝐞       : 17
┃ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧  : Islam
┃ 🏫 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : Inter 2nd Year
┃ ☎️ 𝐂𝐨𝐧𝐭𝐚𝐜𝐭   : 01959135627
┃ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬  : Jhenaidah, Bangladesh
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🎭 𝐓𝐢𝐤𝐓𝐨𝐤   : Protibondhi app rakhi na
┃ 🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : https://www.facebook.com/king.is.back.take.love.all
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🕒 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 𝐓𝐢𝐦𝐞:  ${time}
┗━━━━━━━━━━━━━━━━━━━━━┛`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));

        // Change this UID to your own profile picture UID
        return request(encodeURI("https://graph.facebook.com/100087098984822/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"))
            .pipe(fs.createWriteStream(__dirname + "/cache/1.png"))
            .on("close", () => sendInfo());
    }

    // ... your existing box and user code remains unchanged ...
};