import * as dotenv from "dotenv";

import { createClient, registerEventListeners, start } from "./bot";

import { missingEnvVarError } from "./utils";
import { openDatabase } from "./utils";

dotenv.config();
(async () => {
	const TOKENS = {
		DISCORD: process.env.DISCORD_TOKEN, // Required. Get your token from https://discord.com/developers/applications
		STATCORD: process.env.STATCORD_TOKEN, // Required. Get your token from https://statcord.com/
		HYPIXEL: process.env.HYPIXEL_TOKEN, // Required. Get your token in Minecraft on mc.hypixel.net by running /api
		TOP_GG: process.env.TOP_GG_TOKEN, // Optional. Get your token from https://top.gg/
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

	const db = await openDatabase();
	const { client, statcord, topGGPoster } = createClient(
		db,
		TOKENS.STATCORD,
		TOKENS.TOP_GG,
	);
	registerEventListeners(db, client, statcord, topGGPoster);
	start(db, client, TOKENS.DISCORD);
})();
