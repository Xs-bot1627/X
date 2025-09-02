module.exports.config = {
  name: "everyonewarn",
  version: "1.0.1",
  credits: "Jehad Joy",
  description: "Funny warning when @everyone is tagged, with different message for girls",
  hasPermission: 0,
  usePrefix: false,
  commandCategory: "fun",
  usages: "",
  cooldowns: 3
};

module.exports.handleEvent = async function({ event, api, Users }) {
  const message = event.body;
  if (!message) return;

  if (message.toLowerCase().includes("@everyone")) {
    const senderID = event.senderID;

    let gender = "unknown";
    try {
      const userInfo = await Users.getData(senderID);
      gender = userInfo?.gender?.toUpperCase() || "unknown";
    } catch (e) {
      console.log("User data fetch failed:", e);
    }

    let replyMsg = "";

    if (gender === "MALE") {
      replyMsg = "খেয়ে দেয়ে কাম নেই রং মারাও রং মারাও ওই হারামির পুত রং মারাও 😡😡";
    } else if (gender === "FEMALE") {
      replyMsg = "ওই মাগী? তোর কী সয়তানে লারে? চুপচাপ থাক, everyone মারাস না 🤨💅";
    } else {
      replyMsg = "রং মারাস, তোরে সিল মাইরা দিমু 😩";
    }

    return api.sendMessage(replyMsg, event.threadID, event.messageID);
  }
};

module.exports.run = async function() {};