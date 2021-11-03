import { Client, Intents, Interaction } from "discord.js";
import { messageCommands, slashCommands, userCommands } from "./commands";

import { Database } from "sqlite";
import { Client as StatcordClient } from "statcord.js";
import { AutoPoster as TopGGAutoPoster } from "topgg-autoposter";
import { buttonHandlers } from "./messageComponentHandlers";
import sqlite3 from "sqlite3";

export function createClient(
	db: Database<sqlite3.Database, sqlite3.Statement>,
	developmentMode: boolean,
	statcordToken: string,
	topGGToken?: string,
): {
	client: Client;
	statcord?: StatcordClient;
	topGGPoster?: ReturnType<typeof TopGGAutoPoster>;
} {
	const client = new Client({
		intents: [
			Intents.FLAGS.GUILDS,
			// Intents.FLAGS.DIRECT_MESSAGES,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_INVITES,
			// Intents.FLAGS.GUILD_MEMBERS,
		],
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
	const statcord = !developmentMode
		? new StatcordClient({
				client,
				key: statcordToken,
		  })
		: undefined;
	const topGGPoster = !developmentMode
		? topGGToken
			? TopGGAutoPoster(topGGToken, client)
			: undefined
		: undefined;
	return { client, statcord, topGGPoster };
}

export function registerEventListeners(
	db: Database<sqlite3.Database, sqlite3.Statement>,
	client: Client,
	statcord?: StatcordClient,
	topGGPoster?: ReturnType<typeof TopGGAutoPoster>,
) {
	client.once("ready", () => {
		console.info("Bot ready.");
		statcord && statcord.autopost();
	});
	client.on("interactionCreate", async (interaction: Interaction) => {
		if (interaction.isCommand()) {
			const command = slashCommands.get(interaction.commandName);
			if (!command) return;
			statcord &&
				statcord.postCommand(
					command.discordData.name,
					interaction.user.id,
				);
			try {
				await command.handler(interaction, db);
				// If it hasn't had a reply or been deffered...
				if (!interaction.replied && !interaction.deferred) {
					await interaction.reply({
						content: "Nothing seemed to happen for some reason.",
						ephemeral: true,
					});
				}
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		} else if (interaction.isContextMenu()) {
			const type = interaction.targetType;
			const command =
				type === "MESSAGE"
					? messageCommands.get(interaction.commandName)
					: userCommands.get(interaction.commandName);
			if (!command) return;
			statcord &&
				statcord.postCommand(
					command.discordData.name,
					interaction.user.id,
				);
			try {
				await command.handler(interaction, db);
			} catch (error) {
				console.error(error);
				await interaction.reply({
					content: "There was an error while executing this action!",
					ephemeral: true,
				});
			}
		} else if (interaction.isMessageComponent()) {
			if (interaction.isButton()) {
				const button = buttonHandlers.get(interaction.customId);
				if (!button) return;
				try {
					await button(interaction, db);
				} catch (error) {
					console.error(error);
					await interaction.reply({
						content:
							"There was an error while handling this button press!",
						ephemeral: true,
					});
				}
			}
		}
	});

	statcord &&
		statcord.on("autopost-start", () => {
			console.log("Started autoposting statistics to Statcord.");
		});
	statcord &&
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

export function start(
	db: Database<sqlite3.Database, sqlite3.Statement>,
	client: Client,
	token: string,
) {
	console.info("Starting bot...");
	client.login(token);
}
