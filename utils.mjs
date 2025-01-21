import fs from 'node:fs';
import path from 'node:path';

// Workaround for __dirname in ESM
// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

const loadCommands = async () => {
  let commands = [];
	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath)
      .filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
      const imported = (await import(filePath));
      const command = ('default' in imported) ? imported['default'] : imported;
      console.log(JSON.stringify(command));
			if ('data' in command && 'execute' in command) {
				commands.push(command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
  return commands;
};

// Workaround for https://gemini.google.com/app/4a19801ef2365531
import { readFile } from 'fs/promises';

async function loadConfig() {
  try {
    const data = await readFile(new URL('./config.json', import.meta.url), 'utf8');
    const config = JSON.parse(data);
    console.log(config.clientId, config.guildId, config.token);
    return config; // Return the config object if needed
  } catch (error) {
    console.error('Error loading config:', error);
    // Handle the error appropriately
    throw error; // Or return a default config
  }
}

export { loadCommands, loadConfig };
