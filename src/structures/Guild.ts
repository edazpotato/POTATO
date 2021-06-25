import { Guild as DiscordGuild, Structures } from "discord.js";
import { GuildMember, Language, PotatoClient, User } from ".";
import { GuildSettings, LanguageID } from "../types";

export default class Guild extends DiscordGuild {
	declare client: PotatoClient;

	constructor(client: PotatoClient, data: Object) {
		super(client, data);
	}

	get languageID(): LanguageID {
		return this.client.settings.guilds.get(
			this.id,
			"languageID",
			this.client.defaultLanguageID
		);
	}

	get language(): Language {
		// @ts-ignore
		return (
			this.client.languages.get(this.languageID) ||
			this.client.languages.get(this.client.defaultLanguageID)
		);
	}

	toString() {
		return `${this.name} (${this.id})`;
	}
}

Structures.extend("Guild", () => Guild);
