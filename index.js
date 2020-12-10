const fs = require('fs');

const Discord = require('discord.js');
const { token, prefix } = require('./config.json');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

// Ready
client.once('ready', () => {
    console.log('Ready!');
    // Activity
    client.user.setActivity('the memeland', { type: 'WATCHING' })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);
});

// Login using token
client.login(token);

// Commands
client.on('message', async message => {
    // Checks if message starts with a prefix or if it's not from another bot
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Split args
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    // Actual command received
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.admin) {
        if (!message.member.roles.cache.find(r => r.name === "Moderators")) {
            message.channel.send(`I'm sorry ${message.author}, I'm afraid I can't do that`);
            message.channel.send("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/HAL9000.svg/1200px-HAL9000.svg.png");
        }
    }

    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.reply(reply);
    }

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
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply(`I tried so hard... but in the end... I couldn't do what you asked.`);
    }
});
