import {
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
} from "@discordjs/builders";
import { GuildMember, Interaction, Message } from "discord.js";

import { Database } from "sqlite";
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

export type EventHandlerType = {
	event: "guildMemberAdd" | "messageCreate";
	handler: (data: Message | GuildMember) => Promise<void>;
};
