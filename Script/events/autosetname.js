module.exports.config = {
  name: "autosetname",
  eventType: ["log:subscribe"],
  version: "1.0.8",
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️ (Finalized by Joy)",
  description: "Auto set nickname for bot & users with [prefix] BOTNAME"
};

module.exports.run = async function ({ api, event, Users, Threads }) {
  const { threadID } = event;
  const botID = api.getCurrentUserID();

  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const pathData = path.join(__dirname, "cache", "autosetname.json");

  let dataJson = [];
  try {
    dataJson = JSON.parse(fs.readFileSync(pathData, "utf-8"));
  } catch {
    dataJson = [];
  }

  // Get thread-specific prefix if set, else use global
  const threadData = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadData.PREFIX || global.config.PREFIX;
  const botBaseName = global.config.BOTNAME;
  const botNickname = `[${prefix}] ${botBaseName}`; // ← your desired format

  const thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };
  const membersAdded = event.logMessageData.addedParticipants;

  for (const participant of membersAdded) {
    const idUser = participant.userFbId;

    // Set nickname for bot
    if (idUser == botID) {
      try {
        await new Promise(res => setTimeout(res, 500));
        await api.changeNickname(botNickname, threadID, botID);
      } catch (err) {
        console.error("[autosetname] Failed to set bot nickname:", err);
      }
      continue;
    }

    // Set nickname for user (if prefix exists in autosetname.json)
    if (thisThread.nameUser.length !== 0) {
      const setNamePrefix = thisThread.nameUser[0];
      const nameInfo = await api.getUserInfo(idUser);
      const fullName = nameInfo[idUser]?.name || "Member";

      await new Promise(resolve => setTimeout(resolve, 1000));
      api.changeNickname(`${setNamePrefix} ${fullName}`, threadID, idUser);
    }
  }

  return; // Silent execution
};