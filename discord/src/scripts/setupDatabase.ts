import { openDatabase } from "../misc/utils";

openDatabase().then(async (db) => {
	try {
		await db.exec(`
		CREATE TABLE "guilds" (
			"discord_id"	TEXT NOT NULL UNIQUE,
			"auto_moderation_enabled"	INTEGER NOT NULL,
			"anti_raid_enabled"	INTEGER NOT NULL,
			PRIMARY KEY("discord_id")
		);
		`);
		console.info('Created table "guilds".');
	} catch (e) {
		console.info('Error creating table "guilds".');
	}

	try {
		await db.exec(`
		CREATE TABLE "stats_system" (
			"id"	INTEGER NOT NULL UNIQUE,
			"timestamp"	INTEGER NOT NULL,
			"memory_use"	INTEGER NOT NULL,
			"memory_total"	INTEGER NOT NULL,
			"cpu_load"	INTEGER NOT NULL,
			"bandwidth_use"	INTEGER NOT NULL,
			PRIMARY KEY("id" AUTOINCREMENT)
		);
		`);
		console.info('Created table "stats_system".');
	} catch (e) {
		console.info('Error creating table "stats_system".');
	}

	try {
		await db.exec(`
		CREATE TABLE "stats_bot" (
			"id"	INTEGER NOT NULL UNIQUE,
			"timestamp"	INTEGER NOT NULL,
			"guilds"	INTEGER NOT NULL,
			"users"	INTEGER NOT NULL,
			"shards"	INTEGER NOT NULL,
			"clusters"	INTEGER NOT NULL,
			PRIMARY KEY("id" AUTOINCREMENT)
		);
		`);
		console.info('Created table "stats_bot".');
	} catch (e) {
		console.info('Error creating table "stats_bot".');
	}

	try {
		await db.exec(`
		CREATE TABLE "stats_bot_command_invocations" (
			"id"	INTEGER NOT NULL UNIQUE,
			"timestamp"	INTEGER NOT NULL,
			"guild_id"	TEXT,
			"user_id"	TEXT,
			"command_name"	TEXT NOT NULL,
			"sub_command_name"	TEXT,
			PRIMARY KEY("id" AUTOINCREMENT)
		);
		`);
		console.info('Created table "stats_bot_command_invocations".');
	} catch (e) {
		console.info('Error creating table "stats_bot_command_invocations".');
	}

	return;
});
