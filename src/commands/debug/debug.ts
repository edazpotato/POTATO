import { Client, Command, Language, Message } from "../../structures";
import { MessageEmbed, version as discordVersion } from "discord.js";

import { version as akairoVersion } from "discord-akairo";
import { readFileSync } from "fs";

function getGitCommit() {
	const buffer = readFileSync(".git/HEAD");
	const revision = buffer
		.toString()
		.trim()
		.split(/.*[: ]/)
		.slice(-1)[0];
	const hash = readFileSync(`.git/${revision}`).toString().trim();
	return hash;
}

export default class DebugCommand extends Command {
	declare client: Client;

	constructor() {
		super("debug", {
			description: (language: Language) => ({
				about: language.getString("COMMAND_DEBUG_DESCRIPTION"),
			}),
			category: "Debug",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			aliases: ["debug", "version"],
		});
	}

	async exec(message: Message) {
		const embed = new MessageEmbed();
		embed.setTitle(message.language.getString("COMMAND_DEBUG_EMBED_TITLE"));
		embed.setDescription(
			message.language.getString(
				"COMMAND_DEBUG_EMBED_DESCRIPTION",
				getGitCommit()
			)
		);

		embed.addField(
			message.language.getString(
				"COMMAND_DEBUG_EMBED_FIELD_VERSIONS_TITLE"
			),
			message.language.getString(
				"COMMAND_DEBUG_EMBED_FIELD_VERSIONS_VALUE",
				[
					{ name: "discord.js", version: discordVersion },
					{ name: "discord-akairo", version: akairoVersion },
					{
						name: "Gateway",
						version:
							message.client.options.http?.version || "unknown",
					},
				]
			)
		);
		return message.util.send({ embeds: [embed] });
	}
}
