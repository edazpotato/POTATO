import { Client, Message } from "../structures";

import { Inhibitor } from "discord-akairo";

export default class BlacklistInhibitor extends Inhibitor {
	declare client: Client;
	constructor() {
		super("blacklist", {
			reason: "blacklist"
		});
	}

	exec(message: Message) {
		// He's a meanie!
		const blacklist = ["yeet"];
		return blacklist.includes(message.author.id);
	}
}
