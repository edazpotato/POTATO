import { User as DiscordUser, Structures } from "discord.js";
import { Guild, GuildMember, Language, PotatoClient } from ".";
import { LanguageID, UserSettings } from "../types";

export default class User extends DiscordUser {
	declare client: PotatoClient;

	constructor(client: PotatoClient, data: Object) {
		super(client, data);
	}

	get languageID(): LanguageID {
		return this.client.settings.users.get(
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
		return `${this.username}#${this.discriminator} (${this.id})`;
	}

	toMention() {
		return super.toString();
	}
}

Structures.extend("User", () => User);
