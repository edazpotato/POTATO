import { Client, Command, Language, Message } from "../../structures";
import { MessageEmbed, version as discordVersion } from "discord.js";

import { version as akairoVersion } from "discord-akairo";

export default class DebugCommand extends Command {
	declare client: Client;

	constructor() {
		super("debug", {
			description: (language: Language) => ({
				about: language.getString("COMMAND_DEBUG_DESCRIPTION"),
			}),
			category: "debug",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			aliases: ["debug", "version"],
		});
	}

	async exec(message: Message) {
		const embed = new MessageEmbed();
		embed.setTitle(message.language.getString("COMMAND_DEBUG_EMBED_TITLE"));

		embed.addField(
			message.language.getString(
				"COMMAND_DEBUG_EMBED_FIELD_VERSIONS_TITLE"
			),
			message.language.getString(
				"COMMAND_DEBUG_EMBED_FIELD_VERSIONS_TITLE",
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
