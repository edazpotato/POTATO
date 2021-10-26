import { Collection, Interaction, MessageEmbed } from "discord.js";

import { ApplicationCommandType } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { gitCommit } from "../../utils";
import jokes from "../../../data/jokes.json";

const slashCommands = new Collection<string, ApplicationCommandType>();

slashCommands.set("help", {
	discordData: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Provides helpful information about POTATO."),
	handler: async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Help")
					.setColor("RED")
					.setDescription(
						`To see a list of available commands, type a slash (\`/\`) into your Discord client's message box and click on my icon.

Check out https://potato.edaz.codes for more infomation.
My code is at https://github.com/edazpotato/POTATO.
For support, join my discord server: https://discord.gg/mzR7eeZ.
[Report a joke](https://github.com/edazpotato/POTATO/issues/new?assignees=edazpotato&labels=joke+report&template=joke-report.md&title=%5BJOKE-REPORT%5D+).`,
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
		interaction.reply({
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
		interaction.reply({
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
		interaction.reply({
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
		interaction.reply({
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
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Debug")
					.setColor("RED")
					.addField(
						"Git commit",
						`Hash: ${gitCommit.hash.short}
Message: ${
							gitCommit.message
								.trim()
								.replaceAll("\n", " ")
								.slice(0, 50) +
							(gitCommit.message.length > 50 ? "..." : "")
						}
Author: ${gitCommit.author.name} (*${gitCommit.author.email}*)
Created: <t:${gitCommit.date.getTime()}>
[View commit on Github](https://github.com/edazpotato/POTATO/commit/${
							gitCommit.hash.full
						})
`,
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
		interaction.reply({
			content: "https://top.gg/bot/608921626548895755/vote",
			ephemeral: true,
		});
	},
});

export { slashCommands };
