const { gifs } = require('../config.json');
module.exports = {
    name: 'ally',
    aliases: ['allysha', 'bish'],
    args: false,
    guildOnly: true,
    description: '',
    usage: '',
    execute(message) {
        const embed = {
            color: 0x0099ff,
            title: gifs.ally.message,
            image: {
                url: gifs.ally.url
            },
            footer: {
                text: "\nmeme brought to you by Caleb#5104"
            }
        };
        message.channel.send({ embed: embed });
    }
};