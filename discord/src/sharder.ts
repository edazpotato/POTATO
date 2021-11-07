import { log, missingEnvVarError } from "./misc/utils";

import { Intents } from "discord.js";
import { ShardingManager } from "kurasuta";
import dotenv from "dotenv";
import { join } from "path";
import { openDatabase } from "./misc/utils";
import si from "systeminformation";

const { isPrimary } = require("cluster");

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
const shardCount = developmentMode
	? 2
	: typeof process.env.SHARDS == undefined
	? undefined
	: Number(process.env.SHARDS);

if (isPrimary) {
	if (developmentMode) {
		log("TESTING_GUILD_ID provided. Bot is in development mode.");
	} else {
		log("No TESTING_GUILD_ID provided. Bot is in production mode.");
	}

	openDatabase().then((db) => {
		// Need to run this before anything else so that it can being calculating properly
		si.networkStats().then(() => {
			let usedBytes = 0;
			setInterval(async () => {
				const memory = await si.mem();

				const cpuLoad = Math.round(
					(await si.currentLoad()).currentLoad,
				);

				const netStats = await si.networkStats("*");
				if (usedBytes <= 0)
					usedBytes = netStats.reduce(
						(prev, current) => prev + current.rx_bytes,
						0,
					);
				const usedBytesLatest = netStats.reduce(
					(prev, current) => prev + current.rx_bytes,
					0,
				);
				const bandwidth = usedBytesLatest - usedBytes;
				usedBytes = usedBytesLatest;

				if (developmentMode) {
					console.log({
						$time: Math.floor(Date.now()),
						$bandwidth: bandwidth,
						$cpu_load: cpuLoad,
						$memory_use: memory.used,
						$memory_total: memory.total,
					});
				}

				db.run(
					"INSERT INTO stats_system (timestamp, bandwidth_use, cpu_load, memory_use, memory_total) VALUES $time, $bandwidth, $cpu_load, $memory_use, $memory_total",
					{
						$time: Math.floor(Date.now()),
						$bandwidth: bandwidth,
						$cpu_load: cpuLoad,
						$memory_use: memory.used,
						$memory_total: memory.total,
					},
				);
			}, 60 * 60 * 1000); // Every hour
		});
	});
}

const sharder = new ShardingManager(join(__dirname, "shard"), {
	development: developmentMode,
	clusterCount,
	shardCount,
	token: TOKENS.DISCORD,
	clientOptions: {
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
					type: "PLAYING",
					name: "Starting...",
					url: "https://potato.edaz.codes",
				},
			],
		},
	},
});

sharder.spawn();
