import { Client, Command, Language, Message } from "../../structures";

import { MessageEmbed } from "discord.js";
import centra from "centra";

export default class PickleCommand extends Command {
	declare client: Client;

	constructor() {
		super("hypixel", {
			description: (language: Language) => ({
				about: language.getString("COMMAND_PICKLE_DESCRIPTION"),
				usage: language.getString("COMMAND_PICKLE_USAGE"),
			}),
			category: "Minecraft",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			aliases: ["pickle", "hypixel", "hy"],
			args: [{ id: "playerID", default: null, type: "string" }],
		});
	}

	async exec(
		message: Message,
		{ playerID }: { playerID: string | undefined }
	) {
		console.info("PICKLE!");
		if (!this.client.hypixelAPI)
			return message.error("ERROR_COMMAND_DISABLED");

		try {
			if (playerID) {
				let playerUUID = playerID.toLowerCase();
				if (!playerID.includes("-")) {
					// It's not a UUID, it's a player name
					const res = await centra(
						`https://api.mojang.com/users/profiles/minecraft/${playerID.toLowerCase()}`
					).send();
					if (res.statusCode !== 200)
						return message.error(
							"ERROR_MINECRAFT_PLAYER_NOT_FOUND"
						);
					const data: {
						name: string;
						id: string;
						legacy?: true;
						demo?: true;
						error?: string;
						errorMessage?: string;
					} = await res.json();
					if (data.error)
						return message.error(
							"ERROR_MINECRAFT_PLAYER_NOT_FOUND"
						);
					playerUUID = data.id;
				}
				const player = await this.client.hypixelAPI.player.uuid(
					playerUUID
				);
				if (!player.meta.success)
					return message.error(
						"COMMAND_PICKLE_ERROR_CANNOT_GET_PLAYER_DATA",
						playerID
					);
				const embed = new MessageEmbed();
				embed.setTitle(
					message.language.getString(
						"COMMAND_PICKLE_EMBED_PLAYER_TITLE",
						player
					)
				);

				return message.util.send({ embeds: [embed] });
			} else {
				const watchdogStats =
					await this.client.hypixelAPI.watchdogstats();
				const players = await this.client.hypixelAPI.playerCount();
				const boosters = await this.client.hypixelAPI.boosters();

				if (
					!(
						boosters.meta.success ||
						players.meta.success ||
						watchdogStats.meta.success
					)
				)
					return message.error(
						"COMMAND_PICKLE_ERROR_CANNOT_GET_SERVER_DATA"
					);
				const embed = new MessageEmbed();
				embed.setTitle(
					message.language.getString(
						"COMMAND_PICKLE_EMBED_SERVER_TITLE"
					)
				);
				embed.addField(
					message.language.getString(
						"COMMAND_PICKLE_EMBED_SERVER_FIELD_PLAYERS_NAME"
					),
					message.language.getString(
						"COMMAND_PICKLE_EMBED_SERVER_FIELD_PLAYERS_VALUE",
						players
					),
					true
				);
				embed.addField(
					message.language.getString(
						"COMMAND_PICKLE_EMBED_SERVER_FIELD_BOOSTERS_NAME"
					),
					message.language.getString(
						"COMMAND_PICKLE_EMBED_SERVER_FIELD_BOOSTERS_VALUE",
						boosters
					),
					true
				);
				embed.addField(
					message.language.getString(
						"COMMAND_PICKLE_EMBED_SERVER_FIELD_WATCHDOG_NAME"
					),
					message.language.getString(
						"COMMAND_PICKLE_EMBED_SERVER_FIELD_WATCHDOG_VALUE",
						watchdogStats
					),
					false
				);
				return message.util.send({ embeds: [embed] });
			}
		} catch {
			return message.error("ERROR_NETWORK_REQUEST_FAILED");
		}
	}
}
