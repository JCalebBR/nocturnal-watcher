const { gifs, pngs } = require('../config.json');
module.exports = {
    name: 'ban',
    aliases: ['cancel', 'bonk'],
    args: true,
    guildOnly: true,
    description: 'It bans, cancels or bonks people!',
    usage: '<user>',
    execute(message, args, command) {
        let mentions = [];
        let embed = {
            color: 0x0099ff,
            image: {
                url: ''
            },
            footer: {
                text: "meme brought to you by Caleb#5104"
            }
        };
        if (message.mentions.users.size >= 1) {
            message.mentions.users.forEach(user => {
                mentions.push(user.username);
            });

            if (mentions.includes('Caleb')) {
                message.reply(`I'm sorry, I can't ${command} ${mentions[mentions.indexOf('Caleb')]}, he is like a father to me`);
                return;
            } else if (mentions.includes('Nocturnal Watcher')) {
                message.channel.send(`I'm sorry ${message.author}, I'm afraid I can't do that.`);
                message.channel.send(`${pngs.hal}`);
                return;
            } else {
                embed.title = mentions.join(', ');
                if (message.mentions.users.size > 1) embed.title += " have ";
                else embed.title += " has ";
            }
        } else {
            embed.title = args.join(', ');
            if (args.length > 1) embed.title += " have ";
            else embed.title += " has ";
        }
        embed.image.url += gifs[`${command}`].url;
        embed.title += gifs[`${command}`].message;
        message.channel.send({ embed: embed });
    }
};

