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
	discordData: ContextMenuCommandBuilder | SlashCommandBuilder;
};

export type DatabaseType = Database<sqlite3.Database, sqlite3.Statement>;

export type DatabaseResponseType =
	| { [x: string]: string | number | null }
	| undefined;
