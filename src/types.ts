import {
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
} from "@discordjs/builders";

import { Interaction } from "discord.js";

export type ApplicationCommandType = {
	handler: (interaction: Interaction) => Promise<void>;
	discordData: ContextMenuCommandBuilder | SlashCommandBuilder;
};
