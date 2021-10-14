const { apikeys } = require("../config.json");
const Keyv = require('keyv');

module.exports = {
    name: "changeunits",
    aliases: ["cu", "units", "unit"],
    args: false,
    guildOnly: false,
    cooldown: 5,
    description: "Will toggle between metric or imperial units for the weather command.",
    usage: "",
    tag: "Weather",
    async execute(message, args, Log) {
        const keyv = new Keyv(`${apikeys.mongodb}`);
        keyv.on('error', err => Log.error('Keyv connection error:', err));

        await keyv.get(`${message.author.id}`)
            .then(async data => {
                if (data.units == "metric") { data.units = "imperial"; }
                else { data.units = "metric"; }

                await keyv.set(`${message.author.id}`, data, 2592000000)
                    .then(message.reply(`Your location is set as \`${data.location}\` and your units are \`${data.units}\``));
            });
    }
};