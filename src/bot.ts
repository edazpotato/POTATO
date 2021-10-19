import { Client, Intents, Interaction } from "discord.js";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

export function registerEventListeners() {
	client.once("ready", () => {
		console.info("Bot ready.");
	});
	client.on("interactionCreate", async (interaction: Interaction) => {
		if (interaction.isCommand()) {
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
