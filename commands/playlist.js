const SpotifyWebApi = require('spotify-web-api-node');
const { apikeys } = require('../config.json');
const { pngs } = require('../config.json');
const { msToReadableTime } = require('../util/msToReadableTime.js');

module.exports = {
    name: 'playlist',
    aliases: ['bangers'],
    args: false,
    guildOnly: true,
    description: '',
    usage: '',
    execute(message) {
        let swapi = new SpotifyWebApi({
            clientId: apikeys.spotify.clientId,
            clientSecret: apikeys.spotify.clientSecret,
            // accessToken: apikeys.spotify.accessToken,
            redirectUri: apikeys.spotify.redirectUri
        });

        swapi.clientCredentialsGrant()
            .then(data => {
                swapi.setAccessToken(data.body['access_token']);
            }, err => {
                message.channel.send(err);
            })
            .then(() => {
                swapi.getPlaylist("4m2FtiQKqtkzLIVOGtZPDY")
                    .then(response => {
                        let playlist = response.body;
                        let embed = {
                            color: 0x1DB954,
                            title: playlist.name,
                            url: playlist.external_urls.spotify,
                            author: {
                                name: playlist.owner.display_name,
                                icon_url: pngs.niknocturnal,
                                url: playlist.external_urls.spotify
                            },
                            description: `**Description: **${playlist.description}`,
                            thumbnail: {
                                url: playlist.images[0].url
                            },
                            fields: [
                                {
                                    name: `**Top 5 Tracks : **`,
                                    value: '\u200b',
                                    inline: true
                                },
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: `\nData provided by Spotify Web API, <3`,
                                icon_url: pngs.spotify.white
                            }
                        };
                        console.log(playlist.tracks.items[0]);
                        // console.log(playlist);
                        let length = 0;
                        playlist.tracks.items.forEach((item, index) => {
                            length += item.track.duration_ms;
                            if (index + 1 < 6) {
                                embed.fields.push(
                                    {
                                        name: `${index + 1}. ${item.track.artists[0].name}`,
                                        value: `${item.track.name}`,
                                        inline: true
                                    });
                            }
                        });
                        embed.fields.push({
                            name: `**Followers : **`,
                            value: playlist.followers.total,
                            inline: true
                        });

                        embed.fields.push({
                            name: `**Total length : **`,
                            value: msToReadableTime(length),
                            inline: true
                        });

                        message.channel.send({ embed: embed });
                    }, err => {
                        err = `\`\`\`${err}\`\`\``;
                        message.channel.send(err);
                    });
            });
    }
};