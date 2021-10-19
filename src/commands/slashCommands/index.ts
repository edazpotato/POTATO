import { ApplicationCommandType } from "../../types";
import { Interaction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

const slashCommands: ApplicationCommandType[] = [
	{
		discordData: new SlashCommandBuilder()
			.setName("ping")
			.setDescription("Provides latency information."),
		handler: async (interaction: Interaction) => {
			if (!interaction.isCommand()) return;
		},
	},
	{
		discordData: new SlashCommandBuilder()
			.setName("help")
			.setDescription("Provides helpful information about POTATO."),
		handler: async (interaction: Interaction) => {
			if (!interaction.isCommand()) return;
		},
	},
	{
		discordData: new SlashCommandBuilder()
			.setName("debug")
			.setDescription("Provides information for debugging POTATO."),
		handler: async (interaction: Interaction) => {
			if (!interaction.isCommand()) return;
		},
	},
	{
		discordData: new SlashCommandBuilder()
			.setName("joke")
			.setDescription("Sends funny joke."),
		handler: async (interaction: Interaction) => {
			if (!interaction.isCommand()) return;
		},
	},
];

export default slashCommands;
