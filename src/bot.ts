import * as dotEnvExtended from "dotenv-extended";

import { PotatoClient } from "./structures";

if (!process.env.DISCORD_TOKEN) {
	const env = {
		development: "dev.env",
		production: ".env",
	};

	if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";

	dotEnvExtended.load({
		path: env[process.env.NODE_ENV as "development" | "production"],
	});
}

const client = new PotatoClient({
	enviroment: process.env.NODE_ENV as "development" | "production",
});

client.start(process.env.DISCORD_TOKEN as string);

process.on("unhandledRejection", (err) => console.error(err));
