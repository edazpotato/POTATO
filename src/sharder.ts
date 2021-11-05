const { ShardingManager } = require("kurasuta");
const { Intents } = require("discord.js");
const { join } = require("path");
const dotenv = require("dotenv");
const { isPrimary } = require("cluster");
const { missingEnvVarError, log } = require("./misc/utils");

dotenv.config();

const TOKENS = {
	DISCORD: process.env.DISCORD_TOKEN, // Required. Get your token from https://discord.com/developers/applications
	HYPIXEL: process.env.HYPIXEL_TOKEN, // Required. Get your token in Minecraft on mc.hypixel.net by running /api
	TOP_GG: process.env.TOP_GG_TOKEN, // Optional. Get your token from https://top.gg/
	TESTING_GUILD_ID: process.env.TESTING_GUILD_ID, // Optional. If set, bot is considered to be in development mode.
};

if (!TOKENS.DISCORD)
	throw missingEnvVarError(
		"DISCORD_TOKEN",
		"from https://discord.com/developers/applications",
	);

if (!TOKENS.HYPIXEL)
	throw missingEnvVarError(
		"HYPIXEL_TOKEN",
		"in game in Minecraft on mc.hypixel.net by running the /api command.",
	);

const developmentMode = !!TOKENS.TESTING_GUILD_ID;

const clusterCount = developmentMode ? 2 : undefined;
const shardCount = developmentMode ? 2 : 2;

if (isPrimary) {
	if (developmentMode) {
		log("TESTING_GUILD_ID provided. Bot is in development mode.");
	} else {
		log("No TESTING_GUILD_ID provided. Bot is in production mode.");
	}
}

const sharder = new ShardingManager(join(__dirname, "shard"), {
	development: developmentMode,
	clusterCount,
	shardCount,
	token: TOKENS.DISCORD,
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_INVITES,
		// Intents.FLAGS.GUILD_MEMBERS,
	],
	allowedMentions: { parse: ["users", "roles"] },
	presence: {
		activities: [
			{
				type: "WATCHING",
				name: "for /help",
				url: "https://potato.edaz.codes",
			},
		],
	},
});

sharder.spawn();
