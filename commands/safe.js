const { gifs } = require('../config.json');
module.exports = {
    name: 'safe',
    args: false,
    guildOnly: true,
    description: 'It protects your neck!',
    usage: '',
    tag: 'Fun',
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
        message.lineReply({ embed: embed });
    }
};

