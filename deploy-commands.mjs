import { REST, Routes } from 'discord.js';

import { loadCommands, loadConfig } from './utils.mjs';
const { clientId, guildId, token } = await loadConfig();

const commands = (
	(await loadCommands())
	.map((cmd) => cmd.data.toJSON())
);

const rest = new REST().setToken(token);

try {
	console.debug(
		`Started refreshing ${commands.length} application (/) commands.`
	);

	// The put method is used to fully refresh all commands in the guild with the current set
	const refreshed = await rest.put(
		Routes.applicationGuildCommands(clientId, guildId),
		{ body: commands },
	);

	console.debug(
		`Successfully reloaded ${refreshed.length} application (/) commands.`
	);
} catch (error) {
	console.error(error);
}
