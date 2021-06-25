import * as dotEnvExtended from "dotenv-extended";

import { ShardingManager } from "discord.js";

const env = {
	development: "dev.env",
	production: ".env"
};

if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";

dotEnvExtended.load({
	path: env[process.env.NODE_ENV as "development" | "production"]
});

if (!process.env.DISCORD_TOKEN)
	throw new Error(
		"Discord token not specified! Please set the DISCORD_TOKEN enviroment variable."
	);

const manager = new ShardingManager("./dist/bot.js", {
	token: process.env.DISCORD_TOKEN
});

manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));
manager.spawn();
