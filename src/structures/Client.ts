import * as sqlite from "sqlite";

import {
	AkairoClient,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler,
	SQLiteProvider
} from "discord-akairo";
import { Language, User } from ".";

import { ClientUser as DiscordClientUser } from "discord.js";
import { LanguageID } from "../types";
import fs from "fs";
import sqlite3 from "sqlite3";

export default class Client extends AkairoClient {
	settings: { guilds: SQLiteProvider; users: SQLiteProvider };
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	commandHandler: CommandHandler;
	production: boolean;
	declare user: User & DiscordClientUser;
	languages: Map<LanguageID, Language>;
	defaultLanguageID: LanguageID;
	defaultCommandPrefix: string;

	constructor({ enviroment }: { enviroment: "development" | "production" }) {
		super({ ownerID: "569414372959584256" });

		this.production = enviroment === "production";

		this.defaultCommandPrefix = this.production ? "p/" : "p//";

		this.defaultLanguageID = "en-GB";
		this.languages = new Map();
		this.loadLanguages("ALL");

		this.commandHandler = new CommandHandler(this, {
			directory: "./dist/commands/",
			ignoreCooldown: ["569414372959584256"],
			aliasReplacement: /-/g,
			prefix: (message) => {
				let prefixes = [];
				if (message.guild) {
					prefixes.push(
						this.settings.guilds.get(
							message.guild.id,
							"prefix",
							this.defaultCommandPrefix
						)
					);
				} else {
					prefixes.push(this.defaultCommandPrefix, "");
				}
				return prefixes;
			},
			allowMention: true,
			commandUtil: true,
			commandUtilLifetime: 10000,
			commandUtilSweepInterval: 10000,
			storeMessages: true,
			handleEdits: true
		});

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: "./dist/inhibitors/"
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: "./dist/listeners/"
		});

		const db = sqlite.open({
			filename: "./db.sqlite",
			driver: sqlite3.Database
		});

		this.settings = {
			guilds: new SQLiteProvider(db, "guilds", {
				dataColumn: "settings"
			}),
			users: new SQLiteProvider(db, "users", {
				dataColumn: "settings"
			})
		};

		this.setup();
	}

	setup() {
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler
		});

		this.commandHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();
	}

	loadLanguages(ids: "ALL" | LanguageID[]): number {
		if (ids === "ALL") {
			const files = fs.readdirSync("./languages");
			files.forEach((fileName) => {
				const id = fileName.slice(0, -3) as LanguageID; // All language files end in '.js', so I'm slicing of the last 3 characters to get the ID.
				const data = require(`../../languages/${fileName}`);
				const language = new Language(this, id, data);
				this.languages.set(id, language);
			});
			return files.length;
		} else {
			ids.forEach((id) => {
				const data = require(`../../languages/${id}.js`);
				const language = new Language(this, id, data);
				this.languages.set(id, language);
			});
			return ids.length;
		}
	}

	getLanguage(id: LanguageID) {
		return this.languages.get(id);
	}

	async start(token: string) {
		await Promise.all([
			this.settings.guilds.init(),
			this.settings.users.init()
		]);
		this.login(token);
	}
}
