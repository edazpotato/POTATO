import { Client, Command, Language, Message } from "../../structures";

export default class PingCommand extends Command {
	declare client: Client;

	constructor() {
		super("joke", {
			description: (language: Language) => ({
				about: language.getString("COMMAND_JOKE_DESCRIPTION"),
			}),
			category: "fun",
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			aliases: ["joke", "pun", "dadjoke"],
		});
	}

	async exec(message: Message) {
		return message.send("JOKE");
	}
}
