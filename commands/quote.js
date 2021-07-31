const fetch = require("node-fetch");

module.exports = {
    name: "quote",
    aliases: ["q"],
    args: false,
    guildOnly: true,
    cooldown: 5,
    description: "Returns quotes from twitch",
    usage: "<number>",
    tag: "Twitch",
    async execute(message, args) {
        let url = "https://twitch.center/customapi/quote/list?token=03946e91";
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
                message.lineReply(error.message);
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
        message.lineReply({ embed: embed });
    }
};