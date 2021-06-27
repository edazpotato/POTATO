import { Command, Listener } from "discord-akairo";

import { Message } from "../structures";
import { PermissionString } from "discord.js";

export default class MissingPermissionsListener extends Listener {
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
		console.log(missingPermissions);
		const cleanPermissions = message.language.getString("PERMISSIONS");
	}
}
