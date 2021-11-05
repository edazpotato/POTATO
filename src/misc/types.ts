import {
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";

import { Database } from "sqlite";
import { Interaction } from "discord.js";
import sqlite3 from "sqlite3";

export type ApplicationCommandType = {
	experimental?: boolean;
	handler: (interaction: Interaction, db: DatabaseType) => Promise<void>;
	discordData:
		| ContextMenuCommandBuilder
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder; // I have no idea why I need to do this but when I don't it complains
};

export type DatabaseType = Database<sqlite3.Database, sqlite3.Statement>;
