import {
	ApplicationCommandType,
	DatabaseResponseType,
	DatabaseType,
} from "../../misc/types";
import {
	Collection,
	Interaction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	Permissions,
} from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";
import { onlineTimstamp } from "../../misc/utils";
import packageJSON from "../../../package.json";

const jokes = require("../../../../../jokes.json"); // Fix typescript doing what it's supposed to

const cluster = require("cluster");

const slashCommands = new Collection<string, ApplicationCommandType>();

slashCommands.set("help", {
	discordData: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Provides helpful information about me."),
	handler: async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Help")
					.setColor("RED")

					.setDescription(
						`To see a list of available commands, type a slash (\`/\`) into your Discord client's message box and click on my icon.
For more infomation about me, check out https://potato.edaz.codes.
My code is publicaly available at https://github.com/edazpotato/POTATO.
For support, join my discord server: https://discord.gg/mzR7eeZ.
Is a joke insensitive or offensive? Please report it [here](https://github.com/edazpotato/POTATO/issues/new?assignees=edazpotato&labels=joke+report&template=joke-report.md&title=%5BJOKE-REPORT%5D+).`,
					)
					.addField(
						"Boring stuff",
						`[Privacy policy](https://potato.edaz.codes/legal/privacy), [Terms of service](https://potato.edaz.codes/legal/terms).`,
					),
			],
			ephemeral: true,
		});
	},
});
slashCommands.set("joke", {
	discordData: new SlashCommandBuilder()
		.setName("joke")
		.setDescription("Sends funny joke."),
	handler: async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		const joke = jokes[Math.floor(Math.random() * jokes.length)];
		return interaction.reply({
			content: joke,
		});
	},
});
slashCommands.set("oss", {
	discordData: new SlashCommandBuilder()
		.setName("oss")
		.setDescription("Provides a link to my source code."),
	handler: async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		return interaction.reply({
			content: "https://github.com/edazpotato/POTATO",
			ephemeral: true,
		});
	},
});
slashCommands.set("ping", {
	discordData: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Provides latency information."),
	handler: async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Latency")
					.setColor("RED")
					.addField(
						"💓 Heartbeat",
						`${interaction.client.ws.ping}ms`,
					),
			],
			ephemeral: true,
		});
	},
});
slashCommands.set("invite", {
	discordData: new SlashCommandBuilder()
		.setName("invite")
		.setDescription("Provides a link to add me to another Guild."),
	handler: async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		return interaction.reply({
			content:
				"https://discord.com/api/oauth2/authorize?client_id=608921626548895755&permissions=537226240&scope=bot%20applications.commands",
			ephemeral: true,
		});
	},
});
slashCommands.set("debug", {
	discordData: new SlashCommandBuilder()
		.setName("debug")
		.setDescription("Provides information for debugging me."),
	handler: async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Debug")
					.setColor("RED")
					.setFooter(
						`Shard ${(interaction.client.shard?.id || 0) + 1}/${
							interaction.client.shard?.shardCount
						}, cluster ${
							cluster.isWorker ? cluster.worker.id : 1
						}/${interaction.client.shard?.clusterCount || 1}.`,
					)
					// 					.addField(
					// 						"Git commit",
					// 						`Hash: ${gitCommit.hash.short}
					// Message: ${
					// 							gitCommit.message
					// 								.trim()
					// 								.replaceAll("\n", " ")
					// 								.slice(0, 50) +
					// 							(gitCommit.message.length > 50 ? "..." : "")
					// 						}
					// Author: ${gitCommit.author.name} (*${gitCommit.author.email}*)
					// Created: <t:${Math.floor(gitCommit.date.getTime() / 1000)}>
					// [View commit on Github](https://github.com/edazpotato/POTATO/commit/${
					// 							gitCommit.hash.full
					// 						})
					// `,
					// 					),
					.addField(
						"Metrics",
						`I have \`${jokes.length}\` jokes, I've got \`${
							interaction.client.guilds.cache.size
						}\` guild${
							interaction.client.guilds.cache.size > 1 ? "s" : ""
						} cached, and I came online <t:${Math.floor(
							onlineTimstamp / 1000,
						)}:R>.`,
					)
					.addField(
						"Package versions",
						`I'm using Node.js version \`${
							process.version
						}\`, [\`discord.js\`](https://www.npmjs.com/package/discord.js) version \`${packageJSON.dependencies[
							"discord.js"
						].slice(
							1,
						)}\`, and [\`kurasuta\`](https://www.npmjs.com/package/kurasuta) version \`${packageJSON.dependencies[
							"kurasuta"
						].slice(1)}\`.`,
					),
			],
			ephemeral: true,
		});
	},
});
slashCommands.set("vote", {
	discordData: new SlashCommandBuilder()
		.setName("vote")
		.setDescription("Provides a link to upvote me on Top.GG."),
	handler: async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		return interaction.reply({
			content: "https://top.gg/bot/608921626548895755/vote",
			ephemeral: true,
		});
	},
});
slashCommands.set("deletemydata", {
	experimental: true,
	discordData: new SlashCommandBuilder()
		.setName("deletemydata")
		.setDescription(
			"Request the deletion of your data or the data of a specified guild.",
		),
	handler: async (interaction, db) => {
		if (!interaction.isCommand()) return;
		if (interaction.inCachedGuild()) {
			if (
				!interaction.member.permissions.has(
					Permissions.FLAGS.MANAGE_GUILD,
				)
			)
				return interaction.reply({
					content:
						"To request deletion of all the data stored about you specifc Discord account, run this command in DMs with me. If you're trying to request deletion of the guild's data, ensure that you have the `manage server` permission.",
					ephemeral: true,
				});
			return interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("RED")
						.setDescription(
							"Are you sure that you want to request deletion all of the data that I have stored about this guild? Deleting stored guild data will remove this guild from the databse, disabling my automoderation and antiraid systems in the process.",
						),
				],
				components: [
					new MessageActionRow().addComponents(
						new MessageButton()
							.setCustomId("cancel")
							.setStyle("SECONDARY")
							.setLabel("Cancel"),
						new MessageButton()
							.setCustomId("delete_guild_data")
							.setStyle("DANGER")
							.setLabel("Request guild data deletion"),
					),
				],
			});
		}
		return interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("RED")
					.setDescription(
						"Are you sure that you want to request deletion all of the data that I have stored about you? Deleting stored user data will likely result in worse performance of my automoderation and antiraid systems.\n[Privacy policy](https://potato.edaz.codes/legal/privacy).",
					)
					.setFooter(
						"Requesting stored user data deletion does not stop more data from being collected by me. To stop any more data from being collected, ask a guild admin to disable all data collection systems via the /settings command.",
					),
			],
			components: [
				new MessageActionRow().addComponents(
					new MessageButton()
						.setCustomId("cancel")
						.setStyle("SECONDARY")
						.setLabel("Cancel"),
					new MessageButton()
						.setCustomId("delete_user_data")
						.setStyle("DANGER")
						.setLabel("Request user data deletion"),
				),
			],
		});
	},
});
const settingDiscordData = new SlashCommandBuilder()
	.setName("settings")
	.setDescription("Change my settings for this guild!");
settingDiscordData
	.addSubcommand((subcommand) =>
		subcommand
			.setName("automoderation")
			.setDescription(
				"Enable or disable my automoderation system in this guild.",
			)
			.addStringOption((option) =>
				option
					.setName("action")
					.setDescription(
						"What action do you want to perform on this guild's automoderation setting?",
					)
					.setRequired(true)
					.addChoice("View status", "status")
					.addChoice("Enable", "enable")
					.addChoice("Disable", "disable"),
			),
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("antiraid")
			.setDescription(
				"Enable or disable my antiraid system in this guild.",
			)
			.addStringOption((option) =>
				option
					.setName("action")
					.setDescription(
						"What action do you want to perform on this guild's antiraid setting?",
					)
					.setRequired(true)
					.addChoice("View status", "status")
					.addChoice("Enable", "enable")
					.addChoice("Disable", "disable"),
			),
	);
slashCommands.set("settings", {
	experimental: true,
	discordData: settingDiscordData,
	handler: async (interaction: Interaction, db: DatabaseType) => {
		if (!interaction.isCommand()) return;
		if (!interaction.inCachedGuild())
			return interaction.reply({
				content: "Sorry, you can only use this in a guild channel.",
				ephemeral: true,
			});

		const userIsGuildAdmin = interaction.member.permissions.has(
			Permissions.FLAGS.MANAGE_GUILD,
		);

		switch (interaction.options.getSubcommand()) {
			case "automoderation": {
				switch (interaction.options.getString("action")) {
					case "status": {
						const res = await db.get(
							"SELECT anti_raid_enabled, auto_moderation_enabled FROM guilds WHERE discord_id=$id",
							{ $id: interaction.guild.id },
						);
						if (!res)
							return interaction.reply({
								content:
									"This guild doesn't seem to be in the database. That means that currently, **no messages are being parsed**.",
								ephemeral: true,
							});
						const body = `Automoderation is **${
							res["auto_moderation_enabled"] === 1
								? "enabled"
								: "disabled"
						}** for this guild.\n[Privacy policy](https://potato.edaz.codes/legal/privacy).`;
						const footer =
							res["anti_raid_enabled"] === 1 ||
							res["auto_moderation_enabled"] === 1
								? "I'm currently parsing this guild's messages."
								: "I'm not parsing this guild's messages.";
						return interaction.reply({
							embeds: [
								new MessageEmbed()
									.setColor("RED")
									.setDescription(body)
									.setFooter(footer),
							],
							ephemeral: true,
						});
					}
					case "enable": {
						if (!userIsGuildAdmin)
							return interaction.reply({
								content:
									"In order to do that, you need to be a guild overlord.",
								ephemeral: true,
							});
						let res: DatabaseResponseType = await db.get(
							"SELECT anti_raid_enabled, auto_moderation_enabled FROM guilds WHERE discord_id=$id",
							{ $id: interaction.guild.id },
						);

						// IF the guild isn't in the database yet add it otherwise update the existing reccord.
						if (!res) {
							await db.run(
								"INSERT INTO guilds (discord_id, auto_moderation_enabled, anti_raid_enabled) VALUES ($id, 1, 0)",
								{ $id: interaction.guild.id },
							);
						} else {
							// If automoderation isn't already enabled
							if (res["auto_moderation_enabled"] === 0)
								await db.run(
									"UPDATE guilds SET auto_moderation_enabled=1 WHERE discord_id=$id",
									{ $id: interaction.guild.id },
								);
						}
						return interaction.reply({
							embeds: [
								new MessageEmbed()
									.setColor("RED")
									.setDescription(
										`Automoderation ${
											res &&
											res["auto_moderation_enabled"] === 1
												? "was already"
												: "is now"
										} **enabled** for this guild.\n[Privacy policy](https://potato.edaz.codes/legal/privacy).`,
									)
									.setFooter(
										`I'm ${
											res &&
											res["anti_raid_enabled"] === 1
												? ""
												: "now"
										} parsing this guild's messages.`,
									),
							],
						});
					}
					case "disable": {
						if (!userIsGuildAdmin)
							return interaction.reply({
								content:
									"In order to do that, you need to be a guild overlord.",
								ephemeral: true,
							});

						const res = await db.get(
							"SELECT anti_raid_enabled, auto_moderation_enabled, anti_raid_enabled FROM guilds WHERE discord_id=$id",
							{ $id: interaction.guild.id },
						);
						if (!res)
							return interaction.reply({
								content:
									"This guild doesn't seem to be in the database. That means that currently, **no messages are being parsed**. If you want to use features that require message parsing, a guild admin will need to enable them with the `/setting` command",
								ephemeral: true,
							});

						// If it's currently enabled
						if (res["auto_moderation_enabled"] === 1) {
							await db.run(
								"UPDATE guilds SET auto_moderation_enabled=0 WHERE discord_id=$id",
								{ $id: interaction.guild.id },
							);
						}
						return interaction.reply({
							embeds: [
								new MessageEmbed()
									.setColor("RED")
									.setDescription(
										`Automoderation ${
											res["auto_moderation_enabled"] === 1
												? "is now"
												: "was already"
										} **disabled** for this guild.\n[Privacy policy](https://potato.edaz.codes/legal/privacy).`,
									)
									.setFooter(
										res["anti_raid_enabled"] === 1
											? "I'm still parsing guild's messages because antiraid is enabled."
											: "I'm no longer parsing this guild's messages.",
									),
							],
						});
					}
					default: {
						return interaction.reply({
							content:
								"Something has gone terribly wrong! I couldn't find a handler for the specified subcommand action.",
							ephemeral: true,
						});
					}
				}
			}
			case "antiraid": {
				switch (interaction.options.getString("action")) {
					case "status": {
						const res = await db.get(
							"SELECT auto_moderation_enabled, anti_raid_enabled FROM guilds WHERE discord_id=$id",
							{ $id: interaction.guild.id },
						);
						if (!res)
							return interaction.reply({
								content:
									"This guild doesn't seem to be in the database. That means that currently, **no messages are being parsed**.",
								ephemeral: true,
							});
						const body = `Antiraid is **${
							res["anti_raid_enabled"] === 1
								? "enabled"
								: "disabled"
						}** for this guild.\n[Privacy policy](https://potato.edaz.codes/legal/privacy).`;
						const footer =
							res["anti_raid_enabled"] === 1 ||
							res["auto_moderation_enabled"] === 1
								? "I'm currently parsing this guild's messages."
								: "I'm not parsing this guild's messages.";
						return interaction.reply({
							embeds: [
								new MessageEmbed()
									.setColor("RED")
									.setDescription(body)
									.setFooter(footer),
							],
							ephemeral: true,
						});
					}
					case "enable": {
						if (!userIsGuildAdmin)
							return interaction.reply({
								content:
									"In order to do that, you need to be a guild overlord.",
								ephemeral: true,
							});
						const res: DatabaseResponseType = await db.get(
							"SELECT auto_moderation_enabled, anti_raid_enabled FROM guilds WHERE discord_id=$id",
							{ $id: interaction.guild.id },
						);
						// IF the guild isn't in the database yet add it otherwise update the existing reccord.
						if (!res) {
							await db.run(
								"INSERT INTO guilds (discord_id, auto_moderation_enabled, anti_raid_enabled) VALUES ($id, 0, 1)",
								{ $id: interaction.guild.id },
							);
						} else {
							// If antiraid isn't already enabled
							if (res["anti_raid_enabled"] === 0)
								await db.run(
									"UPDATE guilds SET anti_raid_enabled=1 WHERE discord_id=$id",
									{ $id: interaction.guild.id },
								);
						}
						return interaction.reply({
							embeds: [
								new MessageEmbed()
									.setColor("RED")
									.setDescription(
										`Antiraid ${
											res &&
											res["anti_raid_enabled"] === 1
												? "was already"
												: "is now"
										} **enabled** for this guild.\n[Privacy policy](https://potato.edaz.codes/legal/privacy).`,
									)
									.setFooter(
										`This guild's messages are ${
											res &&
											res["auto_moderation_enabled"] === 1
												? ""
												: "now"
										} being parsed.`,
									),
							],
						});
					}
					case "disable": {
						if (!userIsGuildAdmin)
							return interaction.reply({
								content:
									"In order to do that, you need to be a guild overlord.",
								ephemeral: true,
							});

						const res = await db.get(
							"SELECT auto_moderation_enabled, anti_raid_enabled FROM guilds WHERE discord_id=$id",
							{ $id: interaction.guild.id },
						);
						if (!res)
							return interaction.reply({
								content:
									"This guild doesn't seem to be in the database. That means that currently, **no messages are being parsed**. If you want to use features that require message parsing, a guild admin will need to enable them with the `/setting` command.",
								ephemeral: true,
							});

						// If it's currently enabled
						if (res["anti_raid_enabled"] === 1) {
							await db.run(
								"UPDATE guilds SET anti_raid_enabled=0 WHERE discord_id=$id",
								{ $id: interaction.guild.id },
							);
						}
						return interaction.reply({
							embeds: [
								new MessageEmbed()
									.setColor("RED")
									.setDescription(
										`Antiraid ${
											res["anti_raid_enabled"] === 1
												? "is now"
												: "was already"
										} **disabled** for this guild.\n[Privacy policy](https://potato.edaz.codes/legal/privacy).`,
									)
									.setFooter(
										res["auto_moderation_enabled"] === 1
											? "I'm still parsing guild's messages because automoderation is enabled."
											: "I'm no longer parsing this guild's messages.",
									),
							],
						});
					}
					default: {
						return interaction.reply({
							content:
								"Something has gone terribly wrong! I couldn't find a handler for the specified subcommand action.",
							ephemeral: true,
						});
					}
				}
			}
			default: {
				return interaction.reply({
					content:
						"Something has gone terribly wrong! I couldn't find a handler for the specified subcommand.",
					ephemeral: true,
				});
			}
		}
	},
});

export { slashCommands };
