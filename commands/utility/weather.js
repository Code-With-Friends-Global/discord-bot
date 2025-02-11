import { SlashCommandBuilder } from 'discord.js';

import { EmbedBuilder } from 'discord.js';
import { loadCommands, loadConfig } from '../../utils.mjs';

const { API_NINJA_KEY } = await loadConfig();

console.log(`API NINJA KEY ${API_NINJA_KEY}`);

// Need to get city and state from slash command parameters

const buildLatLongEmbed = async(city, state) => {
	const toLatLong = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${city}&state=${state}&country=US`, {
		headers: {
			"X-Api-Key": API_NINJA_KEY,
			"Content-Type": "application/json",
		  },
	});
	console.log(toLatLong);
	const geocodeEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle(`Where on Earth is ${city}, ${state}`)
	.setURL('https://api-ninjas.com/api/geocoding')
	.setAuthor({ name: 'Coded With Friends', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription(`Latitude and longitude for ${city}, ${state}`)
	.setThumbnail('https://tenor.com/view/matt-frewer-1980s-1985-computer-animation-comedians-gif-16976473')
	// Add fields in horizontal rows
	.addFields(
	  { name: 'Regular field title', value: 'Some value here' },
	  { name: '\u200B', value: '\u200B' },
	  { name: 'First inline field title', value: 'Some first field value', inline: true },
	  { name: 'Second inline field title', value: 'Some value here', inline: true },
	)
	.addFields(
	  { name: 'Inline field title', value: 'Some value', inline: true }
	)
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter({ text: 'Built using API Ninja Geocoding ', iconURL: 'https://i.imgur.com/AfFp7pu.png'})
  ;
};


export default {
	data: (
		new SlashCommandBuilder()
		.setName('weather')
		.setDescription('Converts a city / state name to a latitude / longitude with geocoding.')
	),

	async execute(interaction) {
		const geocodeEmbed = await buildLatLongEmbed('Lacey', 'WA');
		await interaction.reply(
			{ embeds: [geocodeEmbed] }
		);
	},
};
