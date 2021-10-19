import {
	RESTGetAPIOAuth2CurrentApplicationResult,
	Routes,
} from "discord-api-types/v9";
import { contextMenuCommands, slashCommands } from "./commands/index";

import { REST } from "@discordjs/rest";
import dotenv from "dotenv";
import { missingEnvVarError } from "./utils";

dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN)
	throw missingEnvVarError(
		"DISCORD_TOKEN",
		"from https://discord.com/developers/applications",
	);
const TESTING_GUILD_ID = process.env.TESTING_GUILD_ID;
if (TESTING_GUILD_ID) {
	console.info(
		`TESTING_GUILD_ID provided. Only registering commands to ${TESTING_GUILD_ID}.`,
	);
} else {
	console.info(
		"No TESTING_GUILD_ID provided. Registering all commands globaly.",
	);
}

const rest = new REST({ version: "9" }).setToken(TOKEN);

async function registerSlashCommands(
	botData: RESTGetAPIOAuth2CurrentApplicationResult,
) {
	await rest.put(
		TESTING_GUILD_ID
			? Routes.applicationGuildCommands(botData.id, TESTING_GUILD_ID)
			: Routes.applicationCommands(botData.id),
		{
			body: slashCommands.map((command) => command.discordData.toJSON()),
		},
	);
	console.info("Registered slash commands.");
}
async function registerContextMenuCommands(
	botData: RESTGetAPIOAuth2CurrentApplicationResult,
) {
	await rest.put(
		TESTING_GUILD_ID
			? Routes.applicationGuildCommands(botData.id, TESTING_GUILD_ID)
			: Routes.applicationCommands(botData.id),
		{
			body: contextMenuCommands.map((command) =>
				command.discordData.toJSON(),
			),
		},
	);
	console.info("Registered context-menu commands.");
}
async function registerAllCommands(
	botData: RESTGetAPIOAuth2CurrentApplicationResult,
) {
	await registerSlashCommands(botData);
	await registerContextMenuCommands(botData);
	console.info("Registered all commands.");
}

(async () => {
	const botData = (await rest.get(
		Routes.oauth2CurrentApplication(),
	)) as RESTGetAPIOAuth2CurrentApplicationResult;

	registerAllCommands(botData);
})();
