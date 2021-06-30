import { Command, Listener } from "discord-akairo";

import { Message } from "../structures";

export default class ErrorHandler extends Listener {
	constructor() {
		super("error", {
			emitter: "commandHandler",
			event: "error"
		});
	}

	async exec(error: Error, message: Message, command?: Command) {
		console.warn(
			`[${new Date(
				message.editedTimestamp || message.createdTimestamp
			).toLocaleString()}] ${command ? "command" : "inhibitor"} (id: ${
				command && command.id
			}) errored.\n${error}`
		);
	}
}
