import * as sqlite from "sqlite";

import {
	AkairoClient,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler,
	SQLiteProvider
} from "discord-akairo";
import { Language, LanguageHandler, User } from ".";

import { ClientUser as DiscordClientUser } from "discord.js";
import { LanguageID } from "../types";
import fs from "fs";
import sqlite3 from "sqlite3";

export default class Client extends AkairoClient {
	settings: { guilds: SQLiteProvider; users: SQLiteProvider };
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	commandHandler: CommandHandler;
	languageHandler: LanguageHandler;
	production: boolean;
	declare user: User & DiscordClientUser;
	defaultLanguageID: LanguageID;
	defaultCommandPrefix: string;

	constructor({ enviroment }: { enviroment: "development" | "production" }) {
		super({ ownerID: "569414372959584256" });

		this.production = enviroment === "production";

		this.defaultCommandPrefix = this.production ? "p/" : "p//";

		this.defaultLanguageID = "en-GB";

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

		this.languageHandler = new LanguageHandler(this, {
			directory: "./dist/languages/"
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
		this.languageHandler.loadAll();
	}

	getLanguage(id: LanguageID) {
		return this.languageHandler.modules.get(id) as Language;
	}

	async start(token: string) {
		await Promise.all([
			this.settings.guilds.init(),
			this.settings.users.init()
		]);
		this.login(token);
	}
}
