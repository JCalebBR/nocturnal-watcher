const Discord = require('discord.js');
const { apikeys } = require('../config.json');

module.exports = {
    name: 'dog',
    aliases: ['woof', 'arf', 'arfarf'],
    args: false,
    guildOnly: true,
    cooldown: 5,
    description: 'Gets a random dog picture from thedogapi.com',
    usage: '',
    async execute(message) {
        const fetch = require('node-fetch');
        const url = `https://api.thedogapi.com/v1/images/search?`;
        // @ts-ignore
        const params = new URLSearchParams({
            'x-api-key': apikeys['dogapi'],
            'has_breeds': true,
            'size': 'small',
            'limit': 1
        });
        // @ts-ignore
        await fetch(url + params)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                const dog = json[0];
                const breed = dog.breeds[0];
                let description = breed.description;
                if (description == undefined) description = `I'm sorry I can't seem to find a description for this breed. :/`;
                const embed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(breed.name)
                    .setURL(breed.wikipedia_url)
                    .setImage(dog.url)
                    .setDescription(description)
                    .addFields(
                        { name: 'Weight:', value: `${breed.weight["metric"]} kg\n ${breed.weight["imperial"]} lbs`, inline: true },
                        { name: 'Height:', value: `${breed.height["metric"]} cm\n ${breed.height["imperial"]} inches`, inline: true },
                        { name: 'Lifespan:', value: `${breed.life_span}`, inline: true },
                        { name: 'Bred for:', value: `${breed.bred_for}`, inline: true }
                    )
                    .setFooter(`Image provided by thedogapi.com, thanks buddies!`);
                message.channel.send(embed);
            }).catch(error => {
                message.channel.send(error.message);
            });
    }
};