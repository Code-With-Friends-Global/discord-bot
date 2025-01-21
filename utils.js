import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function loadCommands() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = await fs.promises.readdir(foldersPath);

  const commandLoaders = (
    commandFolders
    .map(async (folder) => {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = (
        (await fs.promises.readdir(commandsPath))
        .filter((file) => /\.[mc]?js/i.test(file))
      );
      return (
        commandFiles
        .map(async (file) => {
          const filePath = path.join(commandsPath, file);
          const { default: command } = await import(filePath);
          if ('data' in command && 'execute' in command) {
            return command;
          }
          console.warn(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        })
        .filter(Boolean)
      )
    })
  );

  return await Promise.all(commandLoaders.flat());
}