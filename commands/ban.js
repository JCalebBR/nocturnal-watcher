module.exports = {
    name: 'ban',
    args: true,
    guildOnly: true,
    description: 'It bans people!',
    usage: '<user>',
    execute(message, args) {
        const gif = "https://media1.tenor.com/images/b5bdca61b28524e045d3aa3c124651ea/tenor.gif";
        let mentions = [];
        let embed = {
            color: 0x0099ff,
            image: {
                url: gif
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
                message.reply(`I'm sorry, I can't ban ${mentions[mentions.indexOf('Caleb')]}, he is like a father to me`);
                return;
            } else if (mentions.includes('Nocturnal Watcher')) {
                message.channel.send(`I'm sorry ${message.author}, I'm afraid I can't do that.`);
                message.channel.send("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/1200px-HAL9000.svg.png");
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
        embed.title += "been banned! <:Kappa:780230213485199430>";
        message.channel.send({ embed: embed });
    }
};

