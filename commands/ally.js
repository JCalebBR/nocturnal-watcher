const { gifs } = require("../config.json");
module.exports = {
    name: "ally",
    aliases: ["allysha", "bish"],
    args: false,
    guildOnly: true,
    description: "DJ Roomba!",
    usage: "",
    tag: "Fun",
    execute(message, args, command, Log) {
        const guildId = gifs[message.guildId] ? message.guildId : "default";
        const embed = {
            color: 0x0099ff,
            title: gifs[guildId].ally.message,
            image: {
                url: gifs[guildId].ally.url
            },
            footer: {
                text: "\nmeme brought to you by Caleb#5104"
            }
        };
        message.reply({ embeds: [embed] });
    }
};