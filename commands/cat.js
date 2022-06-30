const Discord = require("discord.js");
const { apikeys } = require("../config.json");

module.exports = {
    name: "cat",
    aliases: ["meow"],
    args: false,
    guildOnly: true,
    cooldown: 5,
    description: "Gets a random cat picture from thecatapi.com",
    usage: "",
    tag: "Fun",
    async execute(message, args, command, Log) {
        const fetch = require("node-fetch");
        const url = `https://api.thecatapi.com/v1/images/search?`;
        // @ts-ignore
        const params = new URLSearchParams({
            "x-api-key": apikeys["catapi"],
            "has_breeds": true,
            "size": "small",
            "limit": 1
        });

        await fetch(url + params)
            .then(response => response.json())
            .then(json => {
                const cat = json[0];
                const breed = cat.breeds[0];
                let description = breed.description;
                if (description == undefined) description = `I'm sorry I can't seem to find a description for this breed. :/`;
                const embed = new Discord.MessageEmbed()
                    .setColor("#0099ff")
                    .setTitle(breed.name)
                    .setURL(breed.wikipedia_url)
                    .setImage(cat.url)
                    .setDescription(description)
                    .addFields(
                        { name: "Weight:", value: `${breed.weight["metric"]} kg\n ${breed.weight["imperial"]} lbs`, inline: true },
                        { name: "Lifespan:", value: `${breed.life_span} years`, inline: true },
                        { name: "Origin:", value: breed.origin, inline: true }
                    )
                    .setFooter(`Image provided by thecatapi.com, thanks buddies!`);

                message.reply({ embeds: [embed] });
            }).catch(error => {
                message.reply(error.message);
            });
    }
};