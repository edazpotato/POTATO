<<<<<<< HEAD
import { Client, Message } from "../structures";

import { Inhibitor } from "discord-akairo";

export default class BlacklistInhibitor extends Inhibitor {
	declare client: Client;
=======
import { Inhibitor } from "discord-akairo";
import { Message } from "../structures";

export default class BlacklistInhibitor extends Inhibitor {
>>>>>>> f7243c81316a9794fdf02af0bc5de2b7f9a3be78
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
