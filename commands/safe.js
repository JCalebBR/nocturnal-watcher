const { gifs } = require('../config.json');
module.exports = {
    name: 'safe',
    args: false,
    guildOnly: true,
    description: 'It protects your neck!',
    usage: '',
    execute(message) {
        const embed = {
            color: 0x0099ff,
            title: gifs.safe.message,
            image: {
                url: gifs.safe.url
            },
            footer: {
                text: "meme brought to you by Caleb#5104"
            }
        };
        message.channel.send({ embed: embed });
    }
};

