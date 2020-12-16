module.exports = {
    name: 'cancel',
    args: true,
    guildOnly: true,
    description: 'It cancels people!',
    usage: '<user>',
    execute(message, args) {
        const gif = "https://media1.tenor.com/images/defaced389aa7815c39752cddf048d9a/tenor.gif";
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
        embed.title += "been canceled! <:Kappa:780230213485199430>\nThey have joined the cancelcore group.";
        message.channel.send({ embed: embed });
    }
};
