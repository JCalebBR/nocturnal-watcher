module.exports = {
    name: 'picture',
    aliases: ['random-pic', 'pic'],
    args: true,
    guildOnly: true,
    cooldown: 5,
    description: 'Description',
    usage: '<width> <height> or <resolution> (for square images)',
    async execute(message, args) {
        const fetch = require('node-fetch');
        let url = ``;
        if (args.length > 1) {
            if (isNaN(args[1])) { return; }
            url += `https://picsum.photos/${args[0]}/${args[1]}`;
        } else {
            url += `https://picsum.photos/${args[0]}`;
        }
        // @ts-ignore
        await fetch(url).then(response => {
            // console.log(response.headers.get('Location'));
            // console.log(response.headers.raw());
            message.channel.send(response.url);
        }).catch(error => {
            message.channel.send(error.message);
        });
    }
};