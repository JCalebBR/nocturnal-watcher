const { gifs } = require('../config.json');
module.exports = {
    name: 'anime',
    args: false,
    guildOnly: true,
    description: 'It bans people!',
    usage: '',
    execute(message) {
        const embed = {
            color: 0x0099ff,
            title: gifs.anime.message,
            image: {
                url: gifs.anime.url
            },
            footer: {
                text: "meme brought to you by Caleb#5104"
            }
        };
        message.channel.send({ embed: embed });
    }
};

