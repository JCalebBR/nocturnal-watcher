const { gifs } = require("../config.json");
module.exports = {
    name: "anime",
    args: false,
    guildOnly: true,
    description: "Nani?",
    usage: "",
    tag: "Fun",
    execute(message) {
        const embed = {
            color: 0x0099ff,
            title: gifs.anime.message,
            image: {
                url: gifs.anime.url
            },
            footer: {
                text: "meme brought to you by Caleb#5104"
            }
        };
        message.lineReply({ embed: embed });
    }
};

