const fetch = require("node-fetch");
const { apikeys } = require("../config.json");

module.exports = {
    name: "quote",
    aliases: ["q"],
    args: false,
    guildOnly: true,
    cooldown: 5,
    description: "Returns quotes from twitch",
    usage: "<number>",
    tag: "Twitch",
    async execute(message, args, command, Log) {
        const guildId = apikeys.nightbot[message.guildId] ? message.guildId : "default";
        const url = apikeys.nightbot[guildId].url;
        let embed = {
            color: 0x0099ff,
            footer: {
                text: "meme brought to you by Caleb#5104"
            }
        };
        // @ts-ignore
        let body = await fetch(url)
            .then(res => res.text())
            .then(body => {
                body = body.split("\n");
                return body;
            }).catch(error => {
                message.reply(error.message);
            });
        let index;
        if (!args.length) index = Math.floor(Math.random() * body.length);
        else if (isNaN(args)) {
            for (let row of body) {
                if (row.includes(args[0])) {
                    index = body.indexOf(row);
                    break;
                }
            }
        }
        else index = args[0] - 1;
        embed.title = body[index];
        message.reply({ embeds: [embed] });
    }
};