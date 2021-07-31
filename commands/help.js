const Discord = require("discord.js");
const { prefix, pngs } = require("../config.json");

module.exports = {
    name: "help",
    aliases: ["h", "commands"],
    args: false,
    guildOnly: false,
    cooldown: 0,
    description: "List all of my commands or info about a specific command.",
    usage: "<command name>",
    tag: "Help",
    execute(message, args) {
        const { commands } = message.client;

        if (!args.length) {
            let embed = {
                color: 0x0099ff,
                author: {
                    name: "Nocturnal Watcher Help Page",
                    icon_url: "https://cdn.discordapp.com/avatars/415958373939413013/0f57e1c378611df1edd6bb51f9b89f83.png"
                },
                description: this.description,
                thumbnail: { url: pngs.watcher.avatar },
                fields: [],
                footer: { text: "meme brought to you by Caleb#5104" }
            };
            let tags = [];
            commands.forEach(command => {
                if (tags.indexOf(command.tag) === -1) tags.push(command.tag);
            });
            tags.forEach(tag => {
                embed.fields.push({ name: tag, value: "", inline: true });
            });
            commands.forEach(command => {
                embed.fields.forEach(field => {
                    if (command.tag === field.name) field.value += command.name + " ";
                });
            });
            return message.lineReply({ embed: embed });
        } else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.lineReply(`That command does not exist!`);
            }
            let embed = {
                color: 0x0099ff,
                author: {
                    name: `${prefix}${command.name} | Help`,
                    icon_url: "https://cdn.discordapp.com/avatars/415958373939413013/0f57e1c378611df1edd6bb51f9b89f83.png"
                },
                thumbnail: { url: pngs.watcher.avatar },
                fields: [],
                footer: { text: `${prefix}${command.name} | Help` }
            };

            embed.fields.push({ name: `Aliases:`, value: `${command.aliases.join(", ") || "No aliases"}` });

            embed.fields.push({ name: `Description:`, value: `${command.description || "No description"}` });

            embed.fields.push({ name: `Usage:`, value: `\`${prefix}${command.name} ${command.usage || ""}\``, inline: true });

            embed.fields.push({ name: `Cooldown:`, value: `${command.cooldown || 3} seconds`, inline: true });

            embed.fields.push({ name: `Server only:`, value: `${command.guildOnly}`, inline: true });

            if (command.admin) embed.fields.push({ name: `Admin:`, value: `${command.admin}`, inline: true });

            message.lineReply({ embed: embed });
        }
    }
};

