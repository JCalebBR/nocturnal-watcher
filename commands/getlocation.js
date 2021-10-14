const { apikeys } = require("../config.json");
const Keyv = require('keyv');

module.exports = {
    name: "getlocation",
    aliases: ["gl", "getl", "getcity", "gc", "city"],
    args: false,
    guildOnly: false,
    cooldown: 5,
    description: "Returns current city set by user",
    usage: "",
    tag: "Weather",
    async execute(message, args, Log) {
        const keyv = new Keyv(`${apikeys.mongodb}`);
        keyv.on('error', err => Log.error('Keyv connection error:', err));

        await keyv.get(`${message.author.id}`)
            .then(async data => {
                await keyv.set(`${message.author.id}`, data, 2592000000);
                data.privacy = (data.privacy.toLowerCase() === "true");
                if (message.channel.type === "DM") message.reply(`Your location is set as \`${data.location}\` and your units are \`${data.units}\``);
                else message.reply(`Your location is set as \`${data.privacy ? "REDACTED" : data.location}\` and your units are \`${data.units}\``);
            })
            .catch(error => {
                if (error instanceof TypeError) { message.reply(`Error retrieving your location, be sure to set it with \`nw!setlocation\`.`); }
                else { return; }
            });
    }
};
