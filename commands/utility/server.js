import { SlashCommandBuilder } from 'discord.js';

import { EmbedBuilder } from 'discord.js';

const exampleEmbed = new EmbedBuilder()
  .setColor(0x0099FF)
  .setTitle('Some title')
  .setURL('https://discord.js.org/')
  .setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
  .setDescription('Some description here')
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
  .setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png'})
;

export default {
	data: (
		new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.')
	),

	async execute(interaction) {
		await interaction.reply(
			{ embeds: [exampleEmbed] }
		);
		/*
		await interaction.reply(
			`This server is ${interaction.guild.name}`
			+ ` and has ${interaction.guild.memberCount} members.`
		);
		*/
	},
};
