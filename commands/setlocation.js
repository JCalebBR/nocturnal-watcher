const { apikeys } = require("../config.json");
const Keyv = require('keyv');

module.exports = {
    name: "setlocation",
    aliases: ["sl", "setl", "setcity", "sc"],
    args: true,
    guildOnly: false,
    dmOnly: true,
    cooldown: 5,
    description: "Sets location of the user",
    usage: "<city>",
    tag: "Weather",
    async execute(message, args) {
        const keyv = new Keyv(`${apikeys.mongodb}`);
        keyv.on('error', err => console.error('Keyv connection error:', err));

        const location = args.join(" ");
        await keyv.get(`${message.author.id}`)
            .then(async data => {
                await keyv.set(`${message.author.id}`, { location: `${location}`, units: `${data.units}`, privacy: `${data.privacy}` }, 2592000000)
                    .then(
                        message.lineReply(`Location set as \`${location}\` and units to \`metric\`.\nPS: Privacy setting is enabled by default, that way when you run the weather command, people won't know your location, to change that run \`nw!privacy\`.\nPSS: If you wish to set the units to \`imperial\`, run \`nw!units\`.`)
                    );
            })
            .catch(async error => {
                await keyv.set(`${message.author.id}`, { location: `${location}`, units: `metric`, privacy: "true" }, 2592000000)
                    .then(
                        message.lineReply(`Location set as \`${location}\` and units to \`metric\`.\nPS: Privacy setting is enabled by default, that way when you run the weather command, people won't know your location, to change that run \`nw!privacy\`.\nPSS: If you wish to set the units to \`imperial\`, run \`nw!units\`.`)
                    );
            });
    }
};