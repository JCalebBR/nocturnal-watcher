module.exports = {
    name: 'idiot',
    aliases: ['trapt'],
    args: false,
    guildOnly: true,
    description: '',
    usage: '',
    execute(message) {
        const images = ["https://www.metal-archives.com/images/1/3/6/9/136916_artist.jpg?1246", "https://images.pulsewebcontent.com/photos/2020/03_Mar/800/Chris%20Taylor%20Brown_03_20.jpg", "https://www.metalsucks.net/wp-content/uploads/2015/02/crapt-620x319.jpg", "https://www.metalsucks.net/wp-content/uploads/2020/03/Everybody-Hates-Chris-Taylor-Brown-1280x720.jpg"];

        const item = Math.floor(Math.random() * images.length);
        message.channel.send(images[item]);
    }
};