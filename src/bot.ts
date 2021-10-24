import { Client, Intents, Interaction } from "discord.js";

import { Client as StatcordClient } from "statcord.js";
import { AutoPoster as TopGGAutoPoster } from "topgg-autoposter";
import { slashCommands } from "./commands/index";

export function createClient(
	statcordToken: string,
	topGGToken?: string,
): {
	client: Client;
	statcord: StatcordClient;
	topGGPoster?: ReturnType<typeof TopGGAutoPoster>;
} {
	const client = new Client({
		intents: [Intents.FLAGS.GUILDS],
		allowedMentions: { parse: ["users", "roles"] },
		presence: {
			activities: [
				{
					type: "WATCHING",
					name: "for /help",
					url: "https://potato.edaz.codes",
				},
			],
		},
	});
	const statcord = new StatcordClient({
		client,
		key: statcordToken,
	});
	const topGGPoster = topGGToken
		? TopGGAutoPoster(topGGToken, client)
		: undefined;
	return { client, statcord, topGGPoster };
}

export function registerEventListeners(
	client: Client,
	statcord: StatcordClient,
	topGGPoster?: ReturnType<typeof TopGGAutoPoster>,
) {
	client.once("ready", () => {
		console.info("Bot ready.");
		statcord.autopost();
	});
	client.on("interactionCreate", async (interaction: Interaction) => {
		if (interaction.isCommand()) {
			const command = slashCommands.get(interaction.commandName);
			if (!command) return;
			statcord.postCommand(command.discordData.name, interaction.user.id);
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

	statcord.on("autopost-start", () => {
		console.log("Started autoposting statistics to Statcord.");
	});
	statcord.on("post", (error) => {
		if (!error) {
			console.info("Successfuly posted statistics to Statcord.");
		} else {
			console.error(error);
		}
	});

	topGGPoster?.on("posted", (stats) => {
		console.log(`Posted stats to Top.gg | ${stats.serverCount} guilds`);
	});

	console.info("Registered listeners.");
}

export function start(client: Client, token: string) {
	console.info("Starting bot...");
	client.login(token);
}
