module.exports = {
    name: 'anime',
    args: false,
    guildOnly: true,
    description: 'It bans people!',
    usage: '<user>',
    execute(message) {
        const gif = "https://cdn.discordapp.com/attachments/785894577164255232/787433205334540318/nik_goes_for_bass.gif";
        const embed = {
            color: 0x0099ff,
            title: "Anime thighs?",
            image: {
                url: gif
            },
            footer: {
                text: "meme brought to you by Caleb#5104"
            }
        };
        message.channel.send({ embed: embed });
    }
};

