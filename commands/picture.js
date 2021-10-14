const fetch = require("node-fetch");
module.exports = {
    name: "picture",
    aliases: ["randompic", "pic"],
    args: false,
    guildOnly: true,
    cooldown: 5,
    description: "Returns a random picture, according to input",
    usage: "<width> <height> | <resolution> for square images",
    tag: "Fun",
    async execute(message, args) {
        if (args.length > 2) {
            message.reply("Please provide up to 2 arguments (width x height)");
            return;
        } else if (args[0] > 5000 || args[1] > 5000) {
            message.reply("Please provide a valid size ranging from 1 to 5000 px");
            return;
        }

        let title;
        let url = "https://picsum.photos/";

        if (args.length > 1) {
            url += args.join("/");
            title = args.join("x");
        }
        else if (!args.length) {
            url += "0/0";
            title = "random sized";
        }
        else {
            url += args.join("/");
            title = `${args[0]}x${args[0]}`;
        }

        let embed = {
            color: 0x0099ff,
            title: `Here's your ${title} picture:`,
            image: {
                url: ""
            },
            footer: {
                text: "picture provided by picsum.photos, thanks buddies!"
            }
        };
        // @ts-ignore
        await fetch(url).then(response => {
            embed.image.url = response.url;
            message.reply({ embeds: [embed] });
        }).catch(error => {
            message.reply(error.message);
        });
    }
};