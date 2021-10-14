//@ts-nocheck
const wapi = require("openweather-apis");
const { apikeys } = require("../config.json");
const Keyv = require('keyv');
const { DateTime } = require("luxon");

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
                title: `Current weather for `,
                author: {
                    icon_url: ""
                },
                description: "Location is under ",
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
                    message.reply(`Error retrieving your location, I can't seem to find it!`);
                    return;
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
                    if (weather.rain) {
                        Math.floor(weather.rain["1h"] * 25.4);
                        Math.floor(weather.rain["3h"] * 25.4);
                    }
                    weather.volume = "in";

                    weather.wind.speed = Math.floor(weather.wind.speed * 2.237);
                    weather.speed = "mph";
                }
                data.location = `${data.location}, ${weather.sys.country}`;
                data.location = `${data.privacy ? "REDACTED" : data.location}`;

                embed.title += data.location;

                embed.thumbnail.url = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
                embed.author.icon_url = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

                embed.description += weather.weather[0].description;

                embed.fields.push({ name: `Temperature:`, value: `${weather.main.temp} ${weather.temp}`, inline: true });
                embed.fields.push({ name: `Heat Index:`, value: `${weather.main.feels_like} ${weather.temp}`, inline: true });
                embed.fields.push({ name: `\u200b`, value: `\u200b`, inline: true });

                // embed.fields.push({ name: `Visibility:`, value: `${weather.visibility} ${weather.dist}`, inline: true });
                embed.fields.push({ name: `Pressure:`, value: `${weather.main.pressure} ${weather.press}`, inline: true });
                embed.fields.push({ name: `Relative Humidity:`, value: `${weather.main.humidity}%`, inline: true });
                embed.fields.push({ name: `Wind:`, value: `${weather.wind.speed} ${weather.speed}`, inline: true });

                embed.fields.push({ name: `Cloudiness:`, value: `${weather.clouds.all}%`, inline: true });
                if (weather.rain != null) embed.fields.push({ name: `Rain Volume:`, value: `1 hour: ${weather.rain["1h"]}${weather.volume}\n3 hours: ${weather.rain["3h"] || "Not enough data"}`, inline: true });
                if (weather.snow != null) embed.fields.push({ name: `Snow Volume:`, value: `1 hour: ${weather.snow["1h"]}${weather.volume}\n3 hours: ${weather.snow["3h"] || "Not enough data"}`, inline: true });

                let hour;
                let sunrise = DateTime.fromSeconds(weather.sys.sunrise, { zone: "utc" });
                hour = weather.timezone / 3600;
                sunrise = sunrise.plus({ hours: Math.trunc(hour), minutes: (hour - Math.trunc(hour)) * 60 });
                embed.fields.push({ name: `Sunrise:`, value: `${sunrise.hour}:${sunrise.minute}`, inline: true });

                let sunset = DateTime.fromSeconds(weather.sys.sunset, { zone: "utc" });
                hour = weather.timezone / 3600;
                sunset = sunset.plus({ hours: Math.trunc(hour), minutes: (hour - Math.trunc(hour)) * 60 });
                embed.fields.push({ name: `Sunset:`, value: `${sunset.hour}:${sunset.minute}`, inline: true });

                let updateTime = DateTime.fromMillis(weather.dt, { zone: "utc" });
                hour = weather.dt;
                // updateTime = updateTime.plus({ hours: Math.trunc(hour), minutes: hour - Math.trunc(hour) });
                embed.footer.text += `${updateTime.hour}:${updateTime.minute}`;
                message.reply({ embeds: [embed] });
            });


        }).catch(async error => {
            if (error instanceof TypeError) {
                await message.reply(`Error retrieving your location, this must be the first time you are running this command.\nI've sent you a DM for the setup.`)
                    .then(async () => {
                        let msg = "Hi, this is the setup for the weather command, but first a few **warnings**:\n\t* I only collect your discord ID and the location you tell me. That information is properly stored and anonymized on my database.\n\t* The stored user data has a 30 days expiration time, that timer is refreshed every time you use any of the weather commands.\nNow if you agree with that, run \`nw!setlocation <location> (city name)\` here in DMs.\nExample: \`nw!setlocation Saint Petersburg\`\nAvoid special characters like \`-:;_\`";
                        try {
                            message.member.send(msg);
                        }
                        catch (error) {
                            message.reply(msg);
                        }
                    });
            } else { Log.log(error); }
        });
    }
};