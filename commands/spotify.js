const SpotifyWebApi = require("spotify-web-api-node");
const { apikeys } = require("../config.json");
const getPlaylistByID = require("../util/getPlaylistByID.js");

module.exports = {
    name: "spotify",
    aliases: ["s", "spoti"],
    args: true,
    guildOnly: true,
    description: "Spotify playlist or artist search",
    usage: "<[playlist (name | id) | artist (name)]>",
    tag: 'Spotify',
    async execute(message, args) {
        let swapi = new SpotifyWebApi({
            clientId: apikeys.spotify.clientId,
            clientSecret: apikeys.spotify.clientSecret,
            redirectUri: apikeys.spotify.redirectUri
        });
        await swapi.clientCredentialsGrant()
            .then(data => {
                swapi.setAccessToken(data.body["access_token"]);
            }, err => {
                message.lineReply(err);
            });

        if (args[0] === "playlist" || args[0] === "p") {
            let input = args.slice(2, args.length);
            console.log(input);
            if (args[1] === "name" || args[1] === "n") {
                input = input.join(" ");
                swapi.searchPlaylists(input)
                    .then(async data => {
                        let results = [];
                        let index = 0;
                        let embed = await getPlaylistByID(data.body.playlists.items[index].id, swapi);
                        embed.footer.text += `\nResult ${index + 1} of ${data.body.playlists.items.length}`;
                        results.push(embed);
                        message.lineReply({ embed: embed })
                            .then(sentEmbed => {
                                const filter = (reaction, user) => {
                                    return ["⬅", "➡", "⏹️"].includes(reaction.emoji.name) && user.id === message.author.id;
                                };

                                const collector = sentEmbed.createReactionCollector(filter, { time: 180000 });

                                sentEmbed.react("⬅")
                                    .then(() => sentEmbed.react("➡")
                                        .then(() => sentEmbed.react("⏹️")));
                                collector.on("collect", async reaction => {
                                    let newEmbed;
                                    if (reaction.emoji.name === "➡") {
                                        if (results[index + 1] === undefined) {
                                            if (index < data.body.playlists.items.length) {
                                                index++;
                                                newEmbed = await getPlaylistByID(data.body.playlists.items[index].id, swapi);
                                                newEmbed.footer.text += `\nResult ${index + 1} of ${data.body.playlists.items.length}`;
                                                sentEmbed.edit({ embed: newEmbed })
                                                    .then(() => sentEmbed.reactions.removeAll()
                                                        .then(() => sentEmbed.react("⬅")
                                                            .then(() => sentEmbed.react("➡")
                                                                .then(() => sentEmbed.react("⏹️")))));
                                                results.push(newEmbed);
                                            } else {
                                                sentEmbed.reactions.removeAll()
                                                    .then(() => sentEmbed.react("⬅")
                                                        .then(() => sentEmbed.react("⏹️")));
                                            }
                                        } else {
                                            index++;
                                            newEmbed = results[index];
                                            sentEmbed.edit({ embed: newEmbed })
                                                .then(() => sentEmbed.reactions.removeAll()
                                                    .then(() => sentEmbed.react("⬅")
                                                        .then(() => sentEmbed.react("➡")
                                                            .then(() => sentEmbed.react("⏹️")))));
                                        }
                                    } else if (reaction.emoji.name === "⬅") {
                                        if (index > 0) {
                                            index--;
                                            newEmbed = results[index];
                                            sentEmbed.edit({ embed: newEmbed })
                                                .then(() => sentEmbed.reactions.removeAll()
                                                    .then(() => sentEmbed.react("⬅")
                                                        .then(() => sentEmbed.react("➡")
                                                            .then(() => sentEmbed.react("⏹️")))));
                                        }
                                    } else {
                                        collector.stop();
                                    }
                                    console.log(index, results.length);
                                });
                                collector.on("end", exception => {
                                    sentEmbed.reactions.removeAll();
                                    console.log(exception);
                                });
                            });
                    });
            } else if (args[1] === "id") {
                let embed = await getPlaylistByID(input, swapi);
                message.channel.send({ embed: embed });
            }
        } else if (args[0] === "artist" || args[0] === "art") {
            let input = args;
            input.shift();
            input = input.join(" ");
            swapi.searchArtists(input)
                .then(async data => {
                    let id = data.body.artists.items[0].id;
                    await swapi.getArtistTopTracks(id, "US")
                        .then(data => {
                            let artist = data.body;
                            console.log(artist);
                        });

                });
        } else if (args[0] === "album" || args[0] === "alb") {
            return;
        } else {
            return;
        }
    }
};