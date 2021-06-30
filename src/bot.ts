import { PotatoClient } from "./structures";

const client = new PotatoClient({
	enviroment: process.env.NODE_ENV as "development" | "production"
});

client.start(process.env.DISCORD_TOKEN as string);

process.on("unhandledRejection", (err) => console.error(err));
