import { Client } from "../structures";
import { Listener } from "discord-akairo";

const permissionsInt = 537152512;

export default class ReadyListener extends Listener {
	declare client: Client;

	constructor() {
		super("ready", {
			emitter: "client",
			event: "ready"
		});
	}

	exec() {
		console.log(`[shard ${this.client.shard?.ids[0]}] I'm ready!`);

		!this.client.production &&
			console.log(
				`Add me to a guild with this URL: https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=${permissionsInt}&scope=bot%20applications.commands`
			);
	}
}
