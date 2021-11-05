// Sorry about the weird mix of ES modules and CommonJS modules in this file,
// it just only works works when I have it like this.

import * as dotenv from "dotenv";

import { log, missingEnvVarError, openDatabase } from "./misc/utils";
import { messageCommands, slashCommands, userCommands } from "./commands";

import { BaseCluster } from "kurasuta";
import { Database } from "sqlite";
import { Interaction } from "discord.js";
import { Client as StatcordClient } from "statcord.js";
import { AutoPoster as TopGGAutoPoster } from "topgg-autoposter";
import { buttonHandlers } from "./messageComponentHandlers";
import sqlite3 from "sqlite3";

const cluster = require("cluster");

module.exports = class extends BaseCluster {
	clusterID?: number = cluster.isWorker ? cluster.worker.id : undefined;
	launch() {
		log(`Launching`, { shard: this.id, cluster: this.clusterID });
		dotenv.config();
		openDatabase().then((db) => {
			const TOKENS = {
				DISCORD: process.env.DISCORD_TOKEN, // Required. Get your token from https://discord.com/developers/applications
				STATCORD: process.env.STATCORD_TOKEN, // Required. Get your token from https://statcord.com/
				HYPIXEL: process.env.HYPIXEL_TOKEN, // Required. Get your token in Minecraft on mc.hypixel.net by running /api
			};

			if (!TOKENS.DISCORD)
				throw missingEnvVarError(
					"DISCORD_TOKEN",
					"from https://discord.com/developers/applications",
				);
			if (!TOKENS.STATCORD)
				throw missingEnvVarError(
					"STATCORD_TOKEN",
					"from https://statcord.com/",
				);
			if (!TOKENS.HYPIXEL)
				throw missingEnvVarError(
					"HYPIXEL_TOKEN",
					"in game in Minecraft on mc.hypixel.net by running the /api command.",
				);
			process.env.DISCORD_TOKEN;

			const clientTemp = this.client;
			// const statcord = !developmentMode
			// 	? new StatcordClient({
			// 			client: clientTemp,
			// 			key: TOKENS.STATCORD,
			// 	  })
			// 	: undefined;

			// const topGGPoster = !developmentMode
			// 	? TOKENS.TOP_GG
			// 		? TopGGAutoPoster(TOKENS.TOP_GG, this.client)
			// 		: undefined
			// 	: undefined;

			// this.registerEventListeners(db, statcord, topGGPoster);
			this.registerEventListeners(db);

			log("Logging in", { shard: this.id, cluster: this.clusterID });
			this.client.login(TOKENS.DISCORD);
		});
	}

	registerEventListeners(
		db: Database<sqlite3.Database, sqlite3.Statement>,
		statcord?: StatcordClient,
		topGGPoster?: ReturnType<typeof TopGGAutoPoster>,
	) {
		this.client.on("ready", () => {
			log("Ready", { shard: this.id, cluster: this.clusterID });
			// statcord && statcord.autopost();
			try {
				this.client.user?.setActivity({
					shardId: this.id,
					type: "WATCHING",
					name: `for /help | ${this.id + 1}/${
						this.client.shard?.shardCount || this.manager.shardCount
					}${
						this.clusterID
							? ` | ${this.clusterID}/${this.manager.clusterCount}`
							: ""
					}`,
					url: "https://potato.edaz.codes/",
				});
			} catch (e) {
				log("Error setting status: " + e, {
					shard: this.id,
					cluster: this.clusterID,
				});
			}
		});
		this.client.on(
			"interactionCreate",
			async (interaction: Interaction) => {
				if (interaction.isCommand()) {
					const command = slashCommands.get(interaction.commandName);
					if (!command) return;
					// statcord &&
					// 	statcord.postCommand(
					// 		command.discordData.name,
					// 		interaction.user.id,
					// 	);
					try {
						await command.handler(interaction, db);
						// If it hasn't had a reply or been deffered...
						if (!interaction.replied && !interaction.deferred) {
							await interaction.reply({
								content:
									"Nothing seemed to happen for some reason.",
								ephemeral: true,
							});
						}
					} catch (error) {
						log("Error handling slash command", {
							shard: this.id,
							cluster: this.clusterID,
						});
						try {
							await interaction.reply({
								content:
									"There was an error while executing this command!",
								ephemeral: true,
							});
						} catch (e) {}
					}
				} else if (interaction.isContextMenu()) {
					const type = interaction.targetType;
					const command =
						type === "MESSAGE"
							? messageCommands.get(interaction.commandName)
							: userCommands.get(interaction.commandName);
					if (!command) return;

					try {
						await command.handler(interaction, db);
					} catch (error) {
						console.error(error);
						await interaction.reply({
							content:
								"There was an error while executing this action!",
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
			},
		);

		// Commmented out until I implement a full custom system because of epic gamer sharding
		// statcord &&
		// 	statcord.on("autopost-start", () => {
		// 		log("Started posting stats to ", this.id);
		// 	});
		// statcord &&
		// 	statcord.on("post", (error) => {
		// 		if (!error) {
		// 			console.info("Successfuly posted statistics to Statcord.");
		// 		} else {
		// 			console.error(error);
		// 		}
		// 	});

		// topGGPoster?.on("posted", (stats) => {
		// 	console.log(`Posted stats to Top.gg | ${stats.serverCount} guilds`);
		// });

		log("Registered listeners", {
			shard: this.id,
			cluster: this.clusterID,
		});
	}
};
