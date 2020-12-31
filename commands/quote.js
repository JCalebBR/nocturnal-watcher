const fetch = require('node-fetch');
const { Menu } = require('discord.js-menu');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'quote',
    aliases: ['q'],
    args: false,
    guildOnly: true,
    cooldown: 5,
    description: 'It quotes',
    usage: '',
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
                body = body.split('\n');
                return body;
            }).catch(error => {
                message.channel.send(error.message);
            });
        let index;
        if (!args.length) index = Math.floor(Math.random() * body.length);
        else if (isNaN(args)) {
            if (args[0] === "list") {
                let menu = new Menu(message.channel, message.author.id, [{
                    name: '0',
                    content: new MessageEmbed({
                        title: 'Quotes list',
                        description: 'This is a list of all quotes from twitch',
                        fields: [
                            {
                                name: "Please head to the next page",
                                value: "just go dude",
                                inline: true
                            }
                        ]
                    }),
                    reactions: {
                        '➡️': 'next',
                        '▶️': 'last'
                    }
                }], 300000);
                body.forEach((row, i) => {
                    menu.pages.push({
                        name: `${i + 1}'`,
                        content: new MessageEmbed({
                            title: `Quotes list`,
                            description: `Page ${i + 1}`,
                            fields: [
                                {
                                    name: "1. INSERT BAND HERE",
                                    value: "Cancel reason: INSERT REASON HERE",
                                    inline: true
                                },
                                {
                                    name: "2. INSERT BAND HERE",
                                    value: "Cancel reason: INSERT REASON HERE",
                                    inline: true
                                },
                                {
                                    name: "3. INSERT BAND HERE",
                                    value: "Cancel reason: INSERT REASON HERE",
                                    inline: true
                                },
                                {
                                    name: "4. INSERT BAND HERE",
                                    value: "Cancel reason: INSERT REASON HERE",
                                    inline: true
                                },
                                {
                                    name: "5. INSERT BAND HERE",
                                    value: "Cancel reason: INSERT REASON HERE",
                                    inline: true
                                }
                            ]
                        }),
                        reactions: {
                            '◀️': '1',
                            '⬅️': 'previous',
                            '➡️': 'next',
                            '▶️': 'last'
                        }
                    });

                });
                // }

                // menu.start();
                // menu.on('pageChange', destination => {
                //     destination.content.title = "Hey, " + message.author.username;
                // });
            }
            for (let row of body) {
                if (row.includes(args[0])) {
                    index = body.indexOf(row);
                    break;
                }
            }
        }
        else index = args[0] - 1;
        embed.title = body[index];
        message.channel.send({ embed: embed });
    }
};