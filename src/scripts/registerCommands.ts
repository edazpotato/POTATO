import * as dotenv from "dotenv";

import {
	RESTGetAPIOAuth2CurrentApplicationResult,
	Routes,
} from "discord-api-types/v9";
import {
	messageCommands,
	slashCommands,
	userCommands,
} from "../commands/index";

import { Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { missingEnvVarError } from "../misc/utils";

const contextMenuCommands = new Collection([
	...messageCommands,
	...userCommands,
]);

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
		`TESTING_GUILD_ID provided. Only registering non-experimental commands to ${TESTING_GUILD_ID}.`,
	);
} else {
	console.info(
		"No TESTING_GUILD_ID provided. Registering all commands globaly.",
	);
}

const experimentGuilds = ["648777120700432384"];

const rest = new REST({ version: "9" }).setToken(TOKEN);

async function registerSlashCommands(
	botData: RESTGetAPIOAuth2CurrentApplicationResult,
) {
	if (!(slashCommands.size > 0)) return;
	// Normal commands
	rest.put(
		TESTING_GUILD_ID
			? Routes.applicationGuildCommands(botData.id, TESTING_GUILD_ID)
			: Routes.applicationCommands(botData.id),
		{
			body: slashCommands
				.filter((command) => !command.experimental)
				.map((command) => command.discordData.toJSON()),
		},
	).then(() => console.info("Registered normal slash commands."));

	// Experimental commands
	const experimentalCommands = slashCommands.filter(
		(command) => !!command.experimental,
	);
	if (experimentalCommands.size > 0) {
		for (const guild of experimentGuilds) {
			await rest.put(Routes.applicationGuildCommands(botData.id, guild), {
				body: experimentalCommands.map((command) =>
					command.discordData.toJSON(),
				),
			});
		}
		console.info("Registered experimental commands to ", experimentGuilds);
	}
}
async function registerContextMenuCommands(
	botData: RESTGetAPIOAuth2CurrentApplicationResult,
) {
	if (contextMenuCommands.size < 1) return;
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
	// console.log(botData);
	await registerAllCommands(botData);
})();
