import { openDatabase } from "./utils";

openDatabase().then(async (db) => {
	try {
		await db.exec(`
		CREATE TABLE "guilds" (
			"discord_id"	TEXT NOT NULL UNIQUE,
			"logging_enabled"	INTEGER NOT NULL,
			"auto_moderation_enabled"	INTEGER NOT NULL,
			"anti_raid_enabled"	INTEGER NOT NULL,
			PRIMARY KEY("discord_id")
		);
		`);
		console.info('Created table "guilds".');
	} catch (e) {
		console.info('Error creating table "guilds".');
	}
	return;
});
