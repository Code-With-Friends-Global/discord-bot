import { SlashCommandBuilder } from 'discord.js';

import { EmbedBuilder } from 'discord.js';
import { loadCommands, loadConfig } from '../../utils.mjs';

const { API_NINJA_KEY } = await loadConfig();

console.log(`API NINJA KEY ${API_NINJA_KEY}`);

const STATES = {
    "Alabama": "AL",
    "Alaska": "AK",
    "Arizona": "AZ",
    "Arkansas": "AR",
    "American Samoa": "AS",
    "California": "CA",
    "Colorado": "CO",
    "Connecticut": "CT",
    "Delaware": "DE",
    "District of Columbia": "DC",
    "Florida": "FL",
    "Georgia": "GA",
    "Guam": "GU",
    "Hawaii": "HI",
    "Idaho": "ID",
    "Illinois": "IL",
    "Indiana": "IN",
    "Iowa": "IA",
    "Kansas": "KS",
    "Kentucky": "KY",
    "Louisiana": "LA",
    "Maine": "ME",
    "Maryland": "MD",
    "Massachusetts": "MA",
    "Michigan": "MI",
    "Minnesota": "MN",
    "Mississippi": "MS",
    "Missouri": "MO",
    "Montana": "MT",
    "Nebraska": "NE",
    "Nevada": "NV",
    "New Hampshire": "NH",
    "New Jersey": "NJ",
    "New Mexico": "NM",
    "New York": "NY",
    "North Carolina": "NC",
    "North Dakota": "ND",
    "Northern Mariana Islands": "MP",
    "Ohio": "OH",
    "Oklahoma": "OK",
    "Oregon": "OR",
    "Pennsylvania": "PA",
    "Puerto Rico": "PR",
    "Rhode Island": "RI",
    "South Carolina": "SC",
    "South Dakota": "SD",
    "Tennessee": "TN",
    "Texas": "TX",
    "Trust Territories": "TT",
    "Utah": "UT",
    "Vermont": "VT",
    "Virginia": "VA",
    "Virgin Islands": "VI",
    "Washington": "WA",
    "West Virginia": "WV",
    "Wisconsin": "WI",
    "Wyoming": "WY"
};

const appendFieldsOrError = async(embed, toLatLong, desiredState) => {
	// console.log("toLatLong " + toLatLong);
	// {"name":"Pasco","latitude":46.2306739,"longitude":-119.0921,"country":"US","state":"Washington"
	if (Array.isArray(toLatLong)) {
		toLatLong
			.filter((field) => (STATES[field.state] === desiredState))
			.forEach((field) => {
			console.log(`field ${JSON.stringify(field)}`)
			embed.addFields(
				{ name: 'Latitude', value: String(field.latitude), inline: true },
				{ name: 'Longitude', value: String(field.longitude), inline: true },
			);
		});
	}
	return embed;
}

// timeInSeconds - absolute event time in seconds, from API result
// "seconds", "minutes", "hours" ago if negative in the past
// in the 
const generateTimeAgoPastString = (timeInSeconds) => {
	const diffSeconds = Math.round(Date.now() / 1000) - timeInSeconds;
	console.log(`Time in Seconds ${diffSeconds}`)
	let diffMinutes = Math.floor(diffSeconds / 60);
	let diffHours = Math.floor(diffMinutes / 60);
	let timeString = "";
	if (diffHours != 0) {
		const plural = (Math.abs(diffHours) > 1) ? 's' : '';
		timeString += `${diffHours} hour${plural} `;
	}
	const plural = (Math.abs(diffMinutes) > 1) ? 's' : '';
	timeString += `${diffMinutes % 60} minute${plural}`;
	const suffix = Math.sign(diffSeconds) < 0 ? " ago" : " from now";
	return timeString + suffix;
}

const appendWeather = ({embed, weatherResult, lat, lon}) => {
	if (!weatherResult) {
		embed.addFields(
			{ 
				name: 'Error', value: `No weather results for lat ${lat} , lon ${lon}`
			}
		)
	} else {
		embed.addFields(
			{ name: "Geographical Coordinates", value: `(${lat}, ${lon})` },
			{ name: "Wind Chill", value: `${weatherResult.wind_degrees} °C` },
			{ name: "Feels Like", value: `${weatherResult.feels_like} °C` },
			{ name: "Temperature", value: `${weatherResult.temp} °C` },
			{ name: "Humidity", value: `${weatherResult.humidity}%`},
			{ name: "Sunset Time", value: `${generateTimeAgoPastString(weatherResult.sunset)}` },
			{ name: "Sunrise Time", value: `${generateTimeAgoPastString(weatherResult.sunrise)}` },
			{ name: "Percentage Cloudiness", value: `${weatherResult.cloud_pct}%` },
			{ name: "Day's Min / Max Temperature Range", value: `${weatherResult.max_temp} – ${weatherResult.min_temp}  °C` },
		);
	};
	return embed;
}

const buildWeatherEmbed = async({city, state}) => {
	const { latitude, longitude } = await getLatLon({city, state});
	console.log(`***` + latitude, longitude);

	const weather = await fetch(`https://api.api-ninjas.com/v1/weather?lat=${latitude}&lon=${longitude}`, {
		headers: {
			"X-Api-Key": API_NINJA_KEY,
			"Content-Type": "application/json",
		  },
	});
	const result = await weather.json();
	const weatherEmbed = (
		new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`Weather ${city}, ${state}`)
		.setURL('https://api-ninjas.com/api/geocoding')
		.setAuthor({ name: 'Coded With Friends', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
		.setDescription(`Weather for ${city}, ${state}`)
		.setThumbnail('https://tenor.com/view/matt-frewer-1980s-1985-computer-animation-comedians-gif-16976473')
		// Add fields in horizontal rows
		.setImage('https://i.imgur.com/AfFp7pu.png')
		.setTimestamp()
		.setFooter({ text: 'Built using API Ninja Geocoding ', iconURL: 'https://i.imgur.com/AfFp7pu.png'})
	)
	return appendWeather({embed: weatherEmbed, weatherResult: result, lat: latitude, lon: longitude});
}

/*
// Need to get city and state from slash command parameters
// https://www.api-ninjas.com/api/geocoding
const buildLatLongEmbed = async(city, state) => {
	const toLatLong = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=US`, {
		headers: {
			"X-Api-Key": API_NINJA_KEY,
			"Content-Type": "application/json",
		  },
	});
	const resultList = (await (await toLatLong).json());
	// console.log("***\n" + resultList);
	const geocodeEmbed = (
		new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`Geocode for ${city}, ${state}`)
		.setURL('https://api-ninjas.com/api/geocoding')
		.setAuthor({ name: 'Coded With Friends', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
		.setDescription(`Latitude and longitude for ${city}, ${state}`)
		.setThumbnail('https://tenor.com/view/matt-frewer-1980s-1985-computer-animation-comedians-gif-16976473')
		// Add fields in horizontal rows
		.setImage('https://i.imgur.com/AfFp7pu.png')
		.setTimestamp()
		.setFooter({ text: 'Built using API Ninja Geocoding ', iconURL: 'https://i.imgur.com/AfFp7pu.png'})
	)
	;
  return appendFieldsOrError(geocodeEmbed, resultList, state);
};
*/

// Need to get city and state from slash command parameters
// https://www.api-ninjas.com/api/geocoding
// returns first matching lat/lon or undefined if no matching city/state
const getLatLon = async({city, state}) => {
	const toLatLong = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}&country=US`, {
		headers: {
			"X-Api-Key": API_NINJA_KEY,
			"Content-Type": "application/json",
		  },
	});
	const resultList = (await (await toLatLong).json());
	console.log("***\n" + JSON.stringify(resultList));
	let filteredList;
	if (Array.isArray(resultList)) {
		filteredList = resultList
			.filter((field) => (STATES[field.state] === state));
		if (filteredList.length > 0) {
			return filteredList[0];
		} else {
			return undefined;
		}
	}
};

export default {
	data: (
		new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Converts a city (and optional state) name to a latitude / longitude with geocoding.')
		.addStringOption(option =>
			option.setName('city')
				.setDescription('The city name')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('state')
				.setDescription('The state name')
				.setRequired(true))
		),

	async execute(interaction) {
		const city = interaction.options.getString('city');
		const state = interaction.options.getString('state');

		const weatherEmbed = await buildWeatherEmbed({city, state});
		await interaction.reply(
			{ embeds: [weatherEmbed] }
		);
	},
};
