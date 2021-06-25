import { Command } from "discord-akairo";
import { Message } from "../structures";
import { MessageEmbed } from "discord.js";

export default class PingCommand extends Command {
	constructor() {
		super("ping", {
			aliases: ["ping"]
		});
	}

	async exec(message: Message) {
		const embed = new MessageEmbed();
		embed.setTitle(message.language.getString("COMMAND_PING_EMBED_TITLE"));
		const sent = await message.util.send({ embed });

		const timeDiff =
			(sent.editedAt?.getTime() || sent.createdAt.getTime()) -
			(message.editedAt?.getTime() || message.createdAt.getTime());

		embed.addField(
			message.language.getString("COMMAND_PING_EMBED_FIELD_RTT_TITLE"),
			`${timeDiff} ms`
		);
		embed.addField(
			message.language.getString(
				"COMMAND_PING_EMBED_FIELD_HEARTBEAT_TITLE"
			),
			`${Math.round(this.client.ws.ping)} ms`
		);
		return sent.edit({ embed });
	}
}
