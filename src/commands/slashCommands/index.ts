import { Collection, Interaction, MessageEmbed } from "discord.js";

import { ApplicationCommandType } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import jokes from "../../../data/jokes.json";

const slashCommands = new Collection<string, ApplicationCommandType>();
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
						`Check out https://potato.edaz.codes for more infomation.
The code is at https://github.com/edazpotato/POTATO.
For support, join my discord server: https://discord.gg/mzR7eeZ.
[Report a joke](https://github.com/edazpotato/POTATO/issues/new?assignees=edazpotato&labels=joke+report&template=joke-report.md&title=%5BJOKE-REPORT%5D+).`,
					),
			],
			ephemeral: true,
		});
	},
});
slashCommands.set("oss", {
	discordData: new SlashCommandBuilder()
		.setName("oss")
		.setDescription("Provites a link to the source code for POTATO."),
	handler: async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		interaction.reply({
			content: "https://github.com/edazpotato/POTATO",
			ephemeral: true,
		});
	},
});
slashCommands.set("debug", {
	discordData: new SlashCommandBuilder()
		.setName("debug")
		.setDescription("Provides information for debugging POTATO."),
	handler: async (interaction: Interaction) => {
		if (!interaction.isCommand()) return;
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Debug")
					.setColor("RED")
					.setDescription(`"Soon™"`),
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

export default slashCommands;
