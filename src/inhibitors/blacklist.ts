import { Inhibitor } from "discord-akairo";
import { Message } from "../structures";

export default class BlacklistInhibitor extends Inhibitor {
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
