const Logging = require("./util/log.js");
const Log = new Logging();
const fs = require("fs");

const Discord = require("discord.js");
const { token, prefix } = require("./config.json");

const botIntents = new Discord.Intents();
botIntents.add(
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING);

const client = new Discord.Client({ intents: botIntents });
const path = require("path");

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
client.once("ready", async () => {
    Log.log("Ready!");
    // Activity
    client.user.setPresence({ activities: [{ name: "the memeland", type: "WATCHING" }], status: "online" });
});

// Login using token
client.login(token);

// Commands
client.on("messageCreate", async message => {
    // Checks if message starts with a prefix or if it"s not from another bot
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) {
        let fahrenheit = /[^a-zA-Z0-9]([+-]?\d+(\.\d+)*)\s?[°º]?([Ff])[^a-zA-Z0-9]/g;
        let celsius = /[^a-zA-Z0-9]([+-]?\d+(\.\d+)*)\s?[°º]?([Cc])[^a-zA-Z0-9]/g;
        let strip = /[^0-9+-]+/g;
        let reply = "";
        message.content = `.${message.content}.`;

        let matchF = message.content.match(fahrenheit);
        if (matchF) {
            matchF.forEach((value) => {
                if (value) {
                    let fvalue = value.replace(strip, '');
                    let number = parseFloat(fvalue);
                    number = (number - 32) * 5 / 9;
                    reply += `${fvalue}ºF -> ${number.toFixed(1)}ºC\n`;
                }
            });
        }

        let matchC = message.content.match(celsius);
        if (matchC) {
            matchC.forEach((value) => {
                if (value) {
                    let cvalue = value.replace(strip, '');
                    let number = parseFloat(cvalue);
                    number = (number * 9 / 5) + 32;
                    reply += `${cvalue}ºC -> ${number.toFixed(1)}ºF\n`;
                }
            });
        }

        if (reply !== "") message.reply(reply);
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
    if (!command) {
        Log.error(`${message.author} tried to use the command "${command}" which doesn't appear to exist!`);
        return;
    }
    // Checks if the command is for staff use
    if (command.admin) {
        if (!message.member.roles.cache.find(r => r.name === "Moderators")) {
            Log.warn(`${message.author} tried to use the staff command "${command}"!`);
            message.channel.send(`I'm sorry ${message.author}, I'm afraid I can't do that\nYou don't have the necessary role.`);
        }
    }
    // Checks if the command is meant to be used only in servers
    if (command.guildOnly && message.channel.type === "DM") {
        Log.warn(`${message.author} tried to use the command "${command}" inside of DMs, but the command is guildOnly`);
        message.reply("I can\'t execute that command inside DMs!");
        return;
    }
    if (command.dmOnly && message.channel.type !== "DM") {
        Log.warn(`${message.author} tried to use the command "${command}" outside of DMs, but the command is dmOnly`);
        message.reply("I can't execute that command outside DMs!");
        return;
    }
    // Checks if the command needs arguments
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments!`;
        // If it has a usage guide, send it
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${commandName} ${command.usage}\``;
        }
        Log.error(`${message.author} tried to use the command "${command}" without arguments!`);
        message.reply(reply);
        return;
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
            Log.debug(`${message.author} tried to use the command "${command}" while it was on cooldown!`);
            message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            return;
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    try {
        message.channel.sendTyping();
        command.execute(message, args, commandName, Log);
    } catch (error) {
        if (error instanceof TypeError) { }
        else {
            Log.log(error);
            message.reply(`I tried so hard... but in the end... I couldn't do what you asked.`);
        }
    }
});