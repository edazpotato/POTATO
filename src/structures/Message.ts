import { Client, Guild, GuildMember, Language, User } from ".";
import {
	DMChannel,
	Message as DiscordMessage,
	NewsChannel,
	Structures,
	TextChannel,
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
			(this.client.languageHandler.modules.get(
				this.client.defaultLanguageID
			) as Language)
		);
	}

	send(key: string = "", ...args: any[]) {
		return this.util.send({
			content: this.language.getString(key, ...args),
		});
	}

	async error(key: string = "", ...args: any[]) {
		return this.channel.send({
			content: this.language.getString(
				"ERROR_MESSAGE",
				this.language.getString(key, ...args)
			),
		});
	}

	async success(key: string = "", ...args: any[]) {
		return this.channel.send({
			content: this.language.getString(
				"SUCCSESS_MESSAGE",
				this.language.getString(key, ...args)
			),
		});
	}
}

Structures.extend("Message", () => Message);
