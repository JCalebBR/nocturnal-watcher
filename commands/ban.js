const { gifs, pngs } = require("../config.json");
module.exports = {
    name: "ban",
    aliases: ["cancel", "bonk"],
    args: true,
    guildOnly: true,
    description: "Bans, cancels or bonks people!",
    usage: "<@user(s)> | <text>",
    tag: "Fun",
    execute(message, args, command, Log) {
        const guildId = gifs[message.guildId] ? message.guildId : "default";
        let mentions = [];
        let embed = {
            color: 0x0099ff,
            image: {
                url: ""
            },
            footer: {
                text: "meme brought to you by Caleb#5104"
            }
        };
        if (message.mentions.users.size >= 1) {
            message.mentions.users.forEach(user => {
                mentions.push(user.username);
            });

            if (mentions.includes("Caleb")) {
                embed.title = `I'm sorry, I can't ${command} ${mentions[mentions.indexOf("Caleb")]}, he is like a father to me`;
                return message.reply({ embeds: [embed] });
            } else if (mentions.includes("Nocturnal Watcher")) {
                embed.title = `I'm sorry, I'm afraid I can't do that.`;
                embed.image.url = `${pngs.hal}`;
                return message.reply({ embeds: [embed] });
            } else {
                embed.title = mentions.join(", ");
                if (message.mentions.users.size > 1) embed.title += " have ";
                else embed.title += " has ";
            }
        } else {
            embed.title = args.join(", ");
            if (args.length > 1) embed.title += " have ";
            else embed.title += " has ";
        }
        embed.image.url += gifs[guildId][`${command}`].url;
        embed.title += gifs[guildId][`${command}`].message;
        message.reply({ embeds: [embed] });
    }
};

