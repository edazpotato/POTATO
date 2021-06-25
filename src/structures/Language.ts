import { Client } from ".";
import { LanguageID } from "../types";

export default class Language {
	private data: object;
	id: LanguageID;
	client: Client;

	constructor(client: Client, id: LanguageID, data: object) {
		this.client = client;
		this.id = id;
		this.data = data;
	}

	getString(key: string, ...args: any[]): string {
		let languageString;
		try {
			// @ts-expect-error
			languageString = this.data[key];
		} catch {
			if (this.id === this.client.defaultLanguageID) {
				return `[${this.id}] STRING_NOT_FOUND`;
			} else {
				try {
					// @ts-expect-error
					languageString = this.client.languages
						.get(this.client.defaultLanguageID)
						.getString(key);
				} catch {
					return `[${this.client.defaultLanguageID} (defaulted from ${this.id})] STRING_NOT_FOUND`;
				}
			}
		}
		// If it's a function, call it with the rest of the paramater. They are probably dynamic values
		if (typeof languageString === "function") {
			languageString = languageString(...args);
		}
		// If it's an array of strings, then choose a random one
		if (Array.isArray(languageString)) {
			languageString =
				languageString[
					Math.floor(Math.random() * languageString.length)
				];
		}
		return languageString;
	}
}
