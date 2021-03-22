const SpotifyWebApi = require('spotify-web-api-node');
const { apikeys } = require('../config.json');
const getPlaylistByID = require('../util/getPlaylistByID');

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
            redirectUri: apikeys.spotify.redirectUri
        });

        swapi.clientCredentialsGrant()
            .then(data => {
                swapi.setAccessToken(data.body['access_token']);
            }, err => {
                message.channel.send(err);
            })
            .then(async () => {
                let embed = await getPlaylistByID("4m2FtiQKqtkzLIVOGtZPDY", swapi);
                message.channel.send({ embed: embed });
            });
    }
};