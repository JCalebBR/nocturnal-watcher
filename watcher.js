const fs = require("fs");

const Discord = require("discord.js");
const { token, prefix } = require("./config.json");
const client = new Discord.Client();
const path = require("path");
const { match } = require("assert");
const dirPath = path.resolve(__dirname, "./commands");

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(dirPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

// Ready
client.once("ready", () => {
    console.log("Ready!");
    // Activity
    client.user.setActivity("the memeland", { type: "WATCHING" })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);
});

// Login using token
client.login(token);

// Commands
client.on("message", async message => {
    // Checks if message starts with a prefix or if it"s not from another bot
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) {
        let fahrenheit = /([+-]?\d+(\.\d+)*)\s?[°º]?([Ff])[^a-zA-Z0-9]/g;
        let strip = /\D+/g;
        let reply = "";
        message.content += ".";
        let match = message.content.match(fahrenheit);
        if (match !== null) {
            match.forEach((value) => {
                if (value !== null) {
                    let fvalue = value.replace(strip, '');
                    let number = parseFloat(fvalue);
                    number = (number - 32) * 5 / 9;
                    reply += `${fvalue}ºF -> ${number.toFixed(1)}ºC\n`;
                }
            });
            message.reply(reply);
        }
        return;
    }

    // Split args
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    // Actual command received
    const commandName = args.shift().toLowerCase();
    // Check if there isd a command file for the command or if it is an alias
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    // If no command found, exit
    if (!command) return;
    // Checks if the command is for staff use
    if (command.admin) {
        if (!message.member.roles.cache.find(r => r.name === "Moderators")) {
            message.channel.send(`I'm sorry ${message.author}, I'm afraid I can't do that\nYou don't have the necessary role.`);
        }
    }
    // Checks if the command is meant to be used only in servers
    if (command.guildOnly && message.channel.type === "dm") {
        return message.reply("I can't execute that command inside DMs!");
    }
    // Checks if the command needs arguments
    if (command.args && !args.length) {
        let reply = "You didn't provide any arguments!";
        // If it has a usage guide, send it
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${commandName} ${command.usage}\``;
        }

        return message.reply(reply);
    }
    // Cooldown
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 2) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, commandName);
    } catch (error) {
        console.error(error);
        message.reply(`I tried so hard... but in the end... I couldn't do what you asked.`);
    }
});