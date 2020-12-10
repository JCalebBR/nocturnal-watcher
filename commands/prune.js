module.exports = {
    name: 'prune',
    args: true,
    guildOnly: true,
    description: 'Delete messages',
    usage: '<1-99>',
    admin: true,
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount) || (amount <= 1 || amount > 100)) return;
        // @ts-ignore
        message.channel.bulkDelete(amount, true).catch(error => {
            console.log(error);
            message.channel.send(`I tried so hard... but in the end... I couldn't do what you asked.`);
        });
    }
};

