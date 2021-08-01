//@ts-nocheck
const wapi = require("openweather-apis");
const { apikeys } = require("../config.json");
const Keyv = require('keyv');
const { DateTime, Settings } = require("luxon");

module.exports = {
    name: "weather",
    aliases: ["hot", "cold", "hell", "w"],
    args: false,
    guildOnly: false,
    cooldown: 5,
    description: "Returns weather info",
    usage: "<city>",
    tag: "Weather",
    async execute(message, args) {
        const keyv = new Keyv(`${apikeys.mongodb}`);
        keyv.on('error', err => console.error('Keyv connection error:', err));

        await keyv.get(`${message.author.id}`).then(async data => {
            if (args.length !== 0) {
                data = {
                    location: args.join(" "),
                    units: "metric",
                    privacy: "false"
                };
            } else {
                await keyv.set(`${message.author.id}`, data, 2592000000);
            }

            data.privacy = (data.privacy.toLowerCase() === "true");

            let embed = {
                color: 0x0099ff,
                title: `Hi ${message.author.username}, here is your weather information for `,
                description: "Your location is under ",
                fields: [],
                thumbnail: { url: "" },
                footer: {
                    text: `Data by openweathermap.org, updated at `
                }
            };

            wapi.setLang("en");
            wapi.setCity(`${data.location}`);
            wapi.setUnits(`${data.units}`);
            wapi.setAPPID(apikeys.openweather);

            wapi.getAllWeather(async (err, weather) => {
                if (weather == null) {
                    throw new EvalError(`Couldn't get weather info`);
                }
                if (data.units === "metric") {
                    weather.temp = "ºC";
                    weather.press = "hPa";
                    weather.dist = "m";
                    weather.volume = "mm";
                    weather.wind.speed = Math.floor(weather.wind.speed * 3.6);
                    weather.speed = "km/h";
                }
                else {
                    weather.temp = "ºF";
                    weather.press = "hPa";

                    weather.visibility = Math.floor(weather.visibility * 3.281);
                    weather.dist = "ft";
                    if (weather.rain["1h"] !== null) Math.floor(weather.rain["1h"] * 25.4);
                    if (weather.rain["3h"] !== null) Math.floor(weather.rain["3h"] * 25.4);
                    weather.volume = "in";

                    weather.wind.speed = Math.floor(weather.wind.speed * 2.237);
                    weather.speed = "mph";
                }
                data.location = `${data.location}, ${weather.sys.country}`;
                data.location = `${data.privacy ? "REDACTED" : data.location}`;

                embed.title += data.location;

                embed.thumbnail.url = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

                embed.description += weather.weather[0].description;

                embed.fields.push({ name: `Temperature:`, value: `${weather.main.temp} ${weather.temp}`, inline: true });
                embed.fields.push({ name: `Heat Index:`, value: `${weather.main.feels_like} ${weather.temp}`, inline: true });

                // embed.fields.push({ name: `Pressure:`, value: `${weather.main.pressure} ${weather.press}`, inline: true });

                embed.fields.push({ name: `Relative Humidity:`, value: `${weather.main.humidity}%`, inline: true });

                // embed.fields.push({ name: `Visibility:`, value: `${weather.visibility} ${weather.dist}`, inline: true });

                embed.fields.push({ name: `Wind:`, value: `${weather.wind.speed} ${weather.speed}`, inline: true });

                if (weather.rain != null) embed.fields.push({ name: `Rain Volume:`, value: `1 hour: ${weather.rain["1h"]}${weather.volume}\n3 hours: ${weather.rain["3h"] || "Not enough data"}`, inline: true });
                if (weather.snow != null) embed.fields.push({ name: `Snow Volume:`, value: `1 hour: ${weather.snow["1h"]}${weather.volume}\n3 hours: ${weather.snow["3h"] || "Not enough data"}`, inline: true });

                embed.fields.push({ name: `Cloudiness:`, value: `${weather.clouds.all}%`, inline: true });

                let sunrise = DateTime.fromSeconds(weather.sys.sunrise);
                sunrise = sunrise.reconfigure({ offset: parseInt(weather.timezone) / 60 });
                embed.fields.push({ name: `Sunrise:`, value: `${sunrise}`, inline: true });

                let sunset = DateTime.fromSeconds(weather.sys.sunset);
                sunset = sunset.reconfigure({ offset: parseInt(weather.timezone) / 60 });
                embed.fields.push({ name: `Sunset:`, value: `${sunset}`, inline: true });

                embed.footer.text += `${DateTime.fromMillis(weather.dt * 1000)}`;
                message.lineReply({ embed: embed });
            });


        }).catch(async error => {
            if (error instanceof TypeError) {
                await message.lineReply(`Error retrieving your location, this must be the first time you are running this command.\nI've sent you a DM for the setup.`)
                    .then(async () => {
                        try {
                            message.member.send("Hi, this is the setup for the weather command, but first a few **warnings**:\n\t* I only collect your discord ID and the location you tell me. That information is properly stored and anonymized on my database.\n\t* The stored user data has a 30 days expiration time, that timer is refreshed every time you use any of the weather commands.");
                            message.member.send("Now if you agree with that, run \`nw!setlocation <location> (city name)\` here in DMs.");
                            message.member.send("Example: \`nw!setlocation Saint Petersburg\`");
                            message.member.send("Avoid special characters like \`-:;_\`");
                        }
                        catch (error) {
                            message.lineReply("Hi, this is the setup for the weather command, but first a few **warnings**:\n\t* I only collect your discord ID and the location you tell me. That information is properly stored and anonymized on my database.\n\t* The stored user data has a 30 days expiration time, that timer is refreshed every time you use any of the weather commands.\nNow if you agree with that, run \`nw!setlocation <location> (city name)\` here in DMs.\nExample: \`nw!setlocation Saint Petersburg\`\nAvoid special characters like \`-:;_\`");
                        }
                    });
            }
            else if (error instanceof EvalError) {
                message.lineReply(`Error retrieving your location, I can't seem to find it!`);
            } else { console.log(error); }
        });
    }
};;