const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`,
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "spy",
    version: "1.0",
    hasPermission: 0,
    usePrefix: true,
    credits: "Dipto",
    description: "Get user information and profile photo",
    commandCategory: "information",
    cooldowns: 10,
  },

  run: async function ({ event, Users, api, args }) {
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];
    let uid;

    // Extract UID
    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    if (!uid) {
      uid = event.type === "message_reply"
        ? event.messageReply.senderID
        : uid2 || uid1;
    }

    // Get baby teach count
    const response = await axios.get(`${await baseApiUrl()}/baby?list=all`);
    const dataa = response.data || { teacher: { teacherList: [] } };
    let babyTeach = 0;

    if (dataa?.teacher?.teacherList?.length) {
      babyTeach = dataa.teacher.teacherList.find((t) => t[uid])?.[uid] || 0;
    }

    // Get user info from Facebook
    let userInfo;
    try {
      userInfo = await api.getUserInfo(uid);
    } catch (e) {
      return api.sendMessage("Failed to fetch user information.", event.threadID);
    }

    const avatarUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    // Gender label
    let genderText = "Not specified";
    if (userInfo[uid].gender === 1) genderText = "Girl (Female)";
    else if (userInfo[uid].gender === 2) genderText = "Boy (Male)";

    // Get stats from user database
    const money = (await Users.get(uid)).money;
    const allUser = await Users.getAll();
    const rank = allUser.slice().sort((a, b) => b.exp - a.exp).findIndex(user => user.userID === uid) + 1;
    const moneyRank = allUser.slice().sort((a, b) => b.money - a.money).findIndex(user => user.userID === uid) + 1;
    const position = userInfo[uid].type;

    // Plain Text Message
    const userInformation = `
USER INFO
Name: ${userInfo[uid].name}
Nickname: ${userInfo[uid].alternateName || "None"}
UID: ${uid}
Class: ${position ? position.toUpperCase() : "Normal User"}
Username: ${userInfo[uid].vanity || "None"}
Gender: ${genderText}
Birthday: ${userInfo[uid].isBirthday !== false ? userInfo[uid].isBirthday : "Private"}
Friend with bot: ${userInfo[uid].isFriend ? "Yes" : "No"}
Profile URL: ${userInfo[uid].profileUrl}

USER STATS
Money: $${formatMoney(money)}
Rank: #${rank}/${allUser.length}
Money Rank: #${moneyRank}/${allUser.length}
Baby Teach: ${babyTeach || 0}
`;

    // Send with avatar
    const avatarStream = (await axios.get(avatarUrl, { responseType: "stream" })).data;

    api.sendMessage({
      body: userInformation,
      attachment: avatarStream,
    }, event.threadID, event.messageID);
  },
};

// Format number to readable money format
function formatMoney(num) {
  const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "N", "D"];
  let unit = 0;
  while (num >= 1000 && ++unit < units.length) num /= 1000;
  return num.toFixed(1).replace(/\.0$/, "") + units[unit];
}