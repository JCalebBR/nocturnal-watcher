module.exports = {
    name: "reload",
    aliases: ["r", "update", "u"],
    args: true,
    guildOnly: false,
    cooldown: 0,
    description: "Reloads a command",
    usage: "<command>",
    admin: true,
    tag: "Admin",
    execute(message, args, command, Log) {
        args.forEach(commandName => {
            commandName = commandName.toLowerCase();
            let command = message.client.commands.get(commandName)
                || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

            if (!command) return message.reply(`There is no command with name or alias \`${commandName}\`!`);

            delete require.cache[require.resolve(`./${command.name}.js`)];

            try {
                let newCommand = require(`./${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
                message.reply(`Command \`${command.name}\` was reloaded!`);
            } catch (error) {
                Log.error(error);
                message.reply(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
            }
        });
    }
};