<<<<<<< HEAD
import { Client, Message } from "../structures";
import { Command, Listener } from "discord-akairo";
import { MessageEmbed, PermissionString } from "discord.js";

export default class MissingPermissionsListener extends Listener {
	declare client: Client;

=======
import { Command, Listener } from "discord-akairo";

import { Message } from "../structures";
import { PermissionString } from "discord.js";

export default class MissingPermissionsListener extends Listener {
>>>>>>> f7243c81316a9794fdf02af0bc5de2b7f9a3be78
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
<<<<<<< HEAD
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
=======
		console.log(missingPermissions);
		const cleanPermissions = message.language.getString("PERMISSIONS");
>>>>>>> f7243c81316a9794fdf02af0bc5de2b7f9a3be78
	}
}
