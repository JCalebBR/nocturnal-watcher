const { pngs } = require('../config.json');
const EmbedBuilder = require('./EmbedBuilder');
const { msToReadableTime } = require('./msToReadableTime.js');

module.exports = async function getPlaylistByID(id, swapi) {
    return await getPlaylistWithTracks(id, swapi)
        .then(async playlist => {
            let embed = new EmbedBuilder(null, playlist.name, playlist.external_urls.spotify, {}, `**Description: **${playlist.description}`, { url: playlist.images[0].url }, [], null, {});

            await swapi.getUser(playlist.owner.id).
                then(data => {
                    let user = data.body;
                    embed.author.name = user.display_name ?? user.id;
                    if (user.images.length > 0) embed.author.icon_url = user.images[0].url;
                    else if (user.id === "niknocturnal") embed.author.icon_url = pngs.niknocturnal;
                    else embed.author.icon_url = "https://i.imgur.com/ez9xzX2.png";
                    embed.author.url = user.external_urls.spotify;
                });
            // let amount = parseInt(args[2] ?? 10);
            let length = 0;
            let empty = {
                name: "\u200b",
                value: "\u200b",
                inline: true
            };
            embed.fields.push({
                name: `**Followers : **`,
                value: playlist.followers.total,
                inline: true
            }, empty, {
                name: `**Total length : **`,
                value: length,
                inline: true
            }, empty);

            let amount = 10;
            if (amount != 11) embed.fields.push({
                name: `**Top ${amount} Tracks : **`,
                value: "\u200b",
                inline: true
            }, empty);

            playlist.tracks.items.forEach((item, index) => {
                length += item.track.duration_ms;
                if (index + 1 < amount + 1) {
                    if (index + 1 === amount) {
                        embed.fields.push(
                            {
                                name: "\u200b",
                                value: "\u200b",
                                inline: true
                            },
                            {
                                name: `${index + 1}. ${item.track.artists[0].name}`,
                                value: `${item.track.name}`,
                                inline: true
                            },
                            {
                                name: "\u200b",
                                value: "\u200b",
                                inline: true
                            });
                    }
                    else embed.fields.push(
                        {
                            name: `${index + 1}. ${item.track.artists[0].name}`,
                            value: `${item.track.name}`,
                            inline: true
                        });
                }
            });
            embed.fields[2].value = msToReadableTime(length);

            return embed;
        }, err => {
            err = `\`\`\`${err}\`\`\``;
            return err;
        });
};


async function getPlaylistWithTracks(id, swapi) {
    const playlist = (await swapi.getPlaylist(id)).body;
    // if there is more tracks than the limit (100 by default)
    if (playlist.tracks.total > playlist.tracks.limit) {
        // Divide the total number of track by the limit to get the number of API calls
        for (let i = 1; i < Math.ceil(playlist.tracks.total / playlist.tracks.limit); i++) {
            const trackToAdd = (await swapi.getPlaylistTracks(id, {
                offset: playlist.tracks.limit * i // Offset each call by the limit * the call's index
            })).body;
            // Push the retreived tracks into the array
            trackToAdd.items.forEach((item) => playlist.tracks.items.push(item));
        }
    }
    return playlist;
}