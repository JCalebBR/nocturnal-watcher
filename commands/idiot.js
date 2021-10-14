const { pngs } = require("../config.json");

module.exports = {
    name: "idiot",
    aliases: ["trapt"],
    args: false,
    guildOnly: true,
    cooldown: 0,
    description: "Returns a random trapt meme.",
    usage: "",
    tag: "Fun",
    execute(message) {
        const item = Math.floor(Math.random() * pngs.trapt.length);
        const embed = {
            color: 0x0099ff,
            title: `Trapt meme #${item + 1}`,
            image: {
                url: pngs.trapt[item]
            },
            footer: {
                text: "\nmeme brought to you by Caleb#5104, acquired from images.google.com"
            }
        };
        message.reply({ embeds: [embed] });
    }
};