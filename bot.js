// Require the necessary discord.js classes
import fs from 'node:fs';
import path from 'node:path';

import {
	Client, Collection, Events, GatewayIntentBits,
} from 'discord.js';
import dotenv from 'dotenv';
import { loadCommands } from './utils';

dotenv.config()

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

console.log(process.env.DISCORD_TOKEN);

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
client.commands = new Collection();

(await loadCommands()).forEach((command) => (
	client.commands.set(command.data.name, command)
));


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(
		interaction.commandName
	);

	if (!command) {
		console.error(
			`No command matching ${interaction.commandName} was found.`
		);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
	console.log(interaction);
});
