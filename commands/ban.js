module.exports = {
    name: 'ban',
    args: true,
    guildOnly: true,
    description: 'It bans people!',
    usage: '<user>',
    execute(message, args) {
        if (!message.mentions.users.size) return message.reply('You need to tag someone to ban!');

        const taggedUser = message.mentions.users.first();

        message.channel.send(`${taggedUser} has been banned! <:Kappa:780230213485199430>`);
    }
}