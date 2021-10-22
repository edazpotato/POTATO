import { Client, Intents, Interaction } from "discord.js";

import { slashCommands } from "./commands/index";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

export function registerEventListeners() {
	client.once("ready", () => {
		console.info("Bot ready.");
	});
	client.on("interactionCreate", async (interaction: Interaction) => {
		if (interaction.isCommand()) {
			const command = slashCommands.get(interaction.commandName);
			if (!command) return;
			try {
				await command.handler(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		} else if (interaction.isContextMenu()) {
		} else if (interaction.isMessageComponent()) {
		}
	});

	console.info("Registered listeners.");
}

export function start(token: string) {
	console.info("Starting bot...");
	client.login(token);
}
