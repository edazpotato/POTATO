import { AkairoHandler, AkairoModule } from "discord-akairo";

import { Client } from ".";
import { LanguageID } from "../types";

interface LanguageOptions {
	enabled: boolean;
}

export default class Language extends AkairoModule {
	declare client: Client;
	enabled: boolean;
	data: any;

	constructor(
		id: LanguageID,
		languageData: any = {},
		{ enabled }: LanguageOptions = { enabled: true }
	) {
		super(id, {});
		this.data = languageData;
		this.enabled = enabled;
	}

	hasKey(key: string) {
		return this.data.hasOwnProperty(key);
	}

	getString(key: string, ...args: any[]): string {
		/* Retrieves a string and does some processing on it */
		const defaultLanguage = this.client.languageHandler.modules.get(
			this.client.defaultLanguageID
		) as Language;

		let value = this.hasKey(key)
			? this.data[key]
			: defaultLanguage.hasKey(key)
			? defaultLanguage.getString(key, ...args)
			: defaultLanguage.getString("STRING_NOT_FOUND", key);

		if (typeof value === "function") {
			/* If it's a function, call it with the rest of the paramater. They are probably dynamic values. */
			value = value(this.client, ...args);
		}
		if (Array.isArray(value)) {
			/* If it's an array of strings, then choose a random one */
			value = value[Math.floor(Math.random() * value.length)];
		}
		return value;
	}
}

export class LanguageHandler extends AkairoHandler {
	constructor(client: Client, { directory }: { directory: string }) {
		super(client, {
			directory,
			classToHandle: Language,
			extensions: [".js"],
			automateCategories: false,
			loadFilter: () => true
		});
	}
}
