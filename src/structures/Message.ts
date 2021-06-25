import { Client, Guild, GuildMember, Language, User } from ".";
import {
	DMChannel,
	Message as DiscordMessage,
	NewsChannel,
	Structures,
	TextChannel
} from "discord.js";

import { CommandUtil } from "discord-akairo";

export default class Message extends DiscordMessage {
	util: CommandUtil;
	declare member: GuildMember;
	declare guild: Guild;
	declare author: User;
	declare client: Client;

	constructor(
		client: Client,
		data: Object,
		channel: DMChannel | TextChannel | NewsChannel
	) {
		super(client, data, channel);
		this.util = new CommandUtil(client.commandHandler, this);
	}

	get language(): Language {
		return (
			this.guild?.language ||
			this.author?.language ||
			this.client.languages.get(this.client.defaultLanguageID)
		);
	}

	send(key: string = "", ...args: any[]) {
		return this.channel.send({
			content: this.language.getString(key)
		});
	}
}

Structures.extend("Message", () => Message);
