const fetch = require('node-fetch');

async function lyricsCommand(sock, chatId, songTitle, message) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { 
            text: '🔍 Please enter the song name to get the lyrics! Usage: *lyrics <song name>*'
        },{ quoted: message });
        return;
    }

    try {
        // API endpoint
        const apiUrl = `https://lyricsapi.fly.dev/api/lyrics?q=${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);

        if (!res.ok) {
            const errText = await res.text();
            throw errText;
        }

        const data = await res.json();

        // ✅ Adjusted according to API structure
        const lyrics = data.lyrics || null;
        const title = data.title || songTitle;
        const artist = data.artist || "Unknown";

        if (!lyrics) {
            await sock.sendMessage(chatId, {
                text: `❌ Sorry, I couldn't find any lyrics for "${songTitle}".`
            },{ quoted: message });
            return;
        }

        const maxChars = 4096;
        const outputLyrics = lyrics.length > maxChars 
            ? lyrics.slice(0, maxChars - 3) + '...' 
            : lyrics;

        const finalMessage = `❏ Title: ${title}\n❏ Artist: ${artist}\n\n${outputLyrics}`;

        await sock.sendMessage(chatId, { text: finalMessage }, { quoted: message });

    } catch (error) {
        console.error('Error in lyrics command:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ An error occurred while fetching the lyrics for "${songTitle}".`
        },{ quoted: message });
    }
}

module.exports = { lyricsCommand };
