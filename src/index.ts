import * as dotenv from "dotenv";

import { createClient, registerEventListeners, start } from "./misc/bot";

import { missingEnvVarError } from "./misc/utils";
import { openDatabase } from "./misc/utils";

dotenv.config();
(async () => {
	const TOKENS = {
		DISCORD: process.env.DISCORD_TOKEN, // Required. Get your token from https://discord.com/developers/applications
		STATCORD: process.env.STATCORD_TOKEN, // Required. Get your token from https://statcord.com/
		HYPIXEL: process.env.HYPIXEL_TOKEN, // Required. Get your token in Minecraft on mc.hypixel.net by running /api
		TOP_GG: process.env.TOP_GG_TOKEN, // Optional. Get your token from https://top.gg/
		TESTING_GUILD_ID: process.env.TESTING_GUILD_ID, // Optional. If set, bot is considered to be in development mode.
	};

	if (!TOKENS.DISCORD)
		throw missingEnvVarError(
			"DISCORD_TOKEN",
			"from https://discord.com/developers/applications",
		);
	if (!TOKENS.STATCORD)
		throw missingEnvVarError(
			"STATCORD_TOKEN",
			"from https://statcord.com/",
		);
	if (!TOKENS.HYPIXEL)
		throw missingEnvVarError(
			"HYPIXEL_TOKEN",
			"in game in Minecraft on mc.hypixel.net by running the /api command.",
		);
	const developmentMode = !!TOKENS.TESTING_GUILD_ID;
	if (developmentMode) {
		console.info("TESTING_GUILD_ID provided. Bot is in development mode.");
	} else {
		console.info(
			"No TESTING_GUILD_ID provided. Bot is in production mode.",
		);
	}

	const db = await openDatabase();
	const { client, statcord, topGGPoster } = createClient(
		db,
		developmentMode,
		TOKENS.STATCORD,
		TOKENS.TOP_GG,
	);
	registerEventListeners(db, client, statcord, topGGPoster);
	start(db, client, TOKENS.DISCORD);
})();
