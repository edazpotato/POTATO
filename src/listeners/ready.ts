<<<<<<< HEAD
import { Client } from "../structures";
import { Listener } from "discord-akairo";

const permissionsInt = 537152512;

export default class ReadyListener extends Listener {
	declare client: Client;

=======
import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
>>>>>>> f7243c81316a9794fdf02af0bc5de2b7f9a3be78
	constructor() {
		super("ready", {
			emitter: "client",
			event: "ready"
		});
	}

	exec() {
		console.log(`[shard ${this.client.shard?.ids[0]}] I'm ready!`);
<<<<<<< HEAD

		!this.client.production &&
			console.log(
				`Add me to a guild with this URL: https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=${permissionsInt}&scope=bot%20applications.commands`
			);
=======
>>>>>>> f7243c81316a9794fdf02af0bc5de2b7f9a3be78
	}
}
