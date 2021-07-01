import * as dotEnvExtended from "dotenv-extended";

import { ShardingManager } from "discord.js";
import Statcord from "statcord.js";

const env = {
	development: "dev.env",
	production: ".env",
};

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";

dotEnvExtended.load({
	path: env[process.env.NODE_ENV as "development" | "production"],
});

if (!process.env.DISCORD_TOKEN)
	throw new Error(
		"Discord token not specified! Please set the DISCORD_TOKEN enviroment variable."
	);

const manager = new ShardingManager("./dist/bot.js", {
	token: process.env.DISCORD_TOKEN,
});

if (!process.env.STATCORD_TOKEN)
	throw new Error(
		"Statcord token not specified! Please set the STATCORD_TOKEN enviroment variable."
	);

const statcord = new Statcord.ShardingClient({
	key: process.env.STATCORD_TOKEN as string,
	manager,
});

statcord.on("autopost-start", () => {
	// Emitted when statcord autopost starts
	console.log(
		`[${new Date().toLocaleString()} | manager] Started autoposting data to Statcord`
	);
});

manager.on("shardCreate", (shard) =>
	console.log(
		`[${new Date().toLocaleString()} | manager] Launched shard ${shard.id}`
	)
);
manager.spawn();
