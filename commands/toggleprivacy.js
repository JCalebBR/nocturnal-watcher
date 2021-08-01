const { apikeys } = require("../config.json");
const Keyv = require('keyv');

module.exports = {
    name: "toggleprivacy",
    aliases: ["privacy"],
    args: false,
    guildOnly: false,
    cooldown: 5,
    description: "Will toggle between the privacy settings, on or off.",
    usage: "",
    tag: "Weather",
    async execute(message, args) {
        const keyv = new Keyv(`${apikeys.mongodb}`);
        keyv.on('error', err => console.error('Keyv connection error:', err));

        if (args[0] === "delete") {
            await keyv.delete(`${message.author.id}`).then(message.lineReply("Your data has been deleted!"));
        } else {
            await keyv.get(`${message.author.id}`)
                .then(async data => {
                    if (data.privacy == "true") { data.privacy = "false"; }
                    else { data.privacy = "true"; }

                    await keyv.set(`${message.author.id}`, data, 2592000000)
                        .then(message.lineReply(`Your privacy is now set to \`${data.privacy}\``));
                });
        }
    }
};