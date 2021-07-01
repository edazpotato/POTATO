import * as sqlite from "sqlite";

import {
	AkairoClient,
	CommandHandler,
	InhibitorHandler,
	ListenerHandler,
	SQLiteProvider,
} from "discord-akairo";
import {
	ClientOptions as DiscordClientOptions,
	ClientUser as DiscordClientUser,
} from "discord.js";
import { Language, LanguageHandler, User } from ".";

import { Intents } from "discord.js";
import { LanguageID } from "../types";
import { Api as TopggAPI } from "@top-gg/sdk";
import sqlite3 from "sqlite3";

const discordOptions: DiscordClientOptions = {
	intents: [Intents.NON_PRIVILEGED],
	shards: "auto",
	presence: {
		status: "online",
		activities: [{ type: "WATCHING", name: "for @POTATO help" }],
	},
};

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
	topggAPI?: TopggAPI;

	constructor({ enviroment }: { enviroment: "development" | "production" }) {
		super({ ownerID: "569414372959584256" }, discordOptions);

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
			handleEdits: true,
		});

		this.inhibitorHandler = new InhibitorHandler(this, {
			directory: "./dist/inhibitors/",
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: "./dist/listeners/",
		});

		this.languageHandler = new LanguageHandler(this, {
			directory: "./dist/languages/",
		});

		const db = sqlite.open({
			filename: "./db.sqlite",
			driver: sqlite3.Database,
		});

		this.settings = {
			guilds: new SQLiteProvider(db, "guilds", {
				dataColumn: "settings",
			}),
			users: new SQLiteProvider(db, "users", {
				dataColumn: "settings",
			}),
		};

		if (process.env.TOP_GG_TOKEN)
			this.topggAPI = new TopggAPI(process.env.TOP_GG_TOKEN);

		this.setup();
	}

	setup() {
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			inhibitorHandler: this.inhibitorHandler,
			listenerHandler: this.listenerHandler,
		});

		this.commandHandler.loadAll();
		this.inhibitorHandler.loadAll();
		this.listenerHandler.loadAll();
		this.languageHandler.loadAll();
	}

	getLanguage(id: LanguageID) {
		return this.languageHandler.modules.get(id) as Language;
	}

	postTopggStats(): Promise<boolean> | boolean {
		if (!this.topggAPI) return false;

		return this.topggAPI
			.postStats({
				serverCount: this.guilds.cache.size,
				shardId: this.shard?.ids[0] || undefined,
				shardCount: this.options.shardCount,
			})
			.then(() => {
				console.info(
					`[${new Date().toLocaleString()} | shard ${
						this.shard?.ids[0]
					}] Posted stats to top.gg`
				);
				return true;
			})
			.catch((err) => {
				console.warn(
					`[${new Date().toLocaleString()} | shard ${
						this.shard?.ids[0]
					}] Error posting Top.gg stats:\n${err}`
				);
				return false;
			});
	}

	async start(token: string) {
		await Promise.all([
			this.settings.guilds.init(),
			this.settings.users.init(),
		]);
		this.login(token);
	}
}
