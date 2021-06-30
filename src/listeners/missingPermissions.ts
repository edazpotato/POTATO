import { Client, Message } from "../structures";
import { Command, Listener } from "discord-akairo";
import { MessageEmbed, PermissionString } from "discord.js";

export default class MissingPermissionsListener extends Listener {
	declare client: Client;

	constructor() {
		super("missingPermissions", {
			emitter: "commandHandler",
			event: "missingPermissions"
		});
	}

	async exec(
		message: Message,
		command: Command,
		type: "client" | "user",
		missingPermissions: PermissionString[]
	) {
		let cleanPermissions = [];
		for (const permission of missingPermissions) {
			cleanPermissions.push(
				message.language.getString("PERMISSIONS", permission)
			);
		}

		return message
			.error(
				"ERROR_MISSING_PERMISSIONS",
				type,
				command.id,
				message.util.parsed?.alias,
				cleanPermissions
			)
			.catch(() => {});
	}
}
