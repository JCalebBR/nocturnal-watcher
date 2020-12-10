module.exports = {
    name: 'cancel',
    args: true,
    guildOnly: true,
    description: 'It cancels people!',
    usage: '<user>',
    execute(message, args) {
        const taggedUser = message.mentions.users.first();

        message.channel.send(`${taggedUser} has been canceled! <:Kappa:780230213485199430> They have joined the cancelcore group.`);
    }
}