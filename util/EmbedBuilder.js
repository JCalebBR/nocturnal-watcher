const { pngs } = require('../config.json');

module.exports = class EmbedBuilder {
    constructor(color = null, title = null, url = null, author = null, description = null, thumbnail = null, fields = null, timestamp = null, footer = null) {

        this.color = color ?? 0x1DB954;
        this.title = title ?? "Title should be here";
        this.url = url ?? "";
        this.author = author ?? {
            name: author.name ?? "Author name everyone??",
            icon_url: author.icon_url ?? "",
            url: author.url ?? ""
        };
        this.description = description ?? `**Description goes here, cmon**`;
        this.thumbnail = {
            url: thumbnail.url ?? "",
        };
        this.fields = fields ?? [];
        this.timestamp = timestamp ?? new Date();
        this.footer = {
            text: footer.text ?? `\nData provided by Spotify Web API, <3`,
            icon_url: footer.icon_url ?? pngs.spotify.black
        };
    }
};