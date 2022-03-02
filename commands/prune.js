module.exports = {
    name: "prune",
    args: true,
    guildOnly: true,
    description: "Deletes messages",
    usage: "<1-99>",
    admin: true,
    tag: "Admin",
    execute(message, args, command, Log) {
        const amount = parseInt(args[0]) + 1;

        if (isNaN(amount) || (amount <= 1 || amount > 100)) return;
        // @ts-ignore
        message.channel.bulkDelete(amount, true).catch(error => {
            Log.error(`${message.guildId} | ${error}`);
        });
    }
};

