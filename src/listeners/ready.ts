import { Client } from "../structures";
import { Listener } from "discord-akairo";

const permissionsInt = 537152512;

export default class ReadyListener extends Listener {
	declare client: Client;

	constructor() {
		super("ready", {
			emitter: "client",
			event: "ready",
		});
	}

	exec() {
		this.client.user.setActivity({
			type: "WATCHING",
			name: `for @${this.client.user.username} help${
				this.client.shard?.ids[0]
					? ` | ${this.client.shard?.ids[0]}/${this.client.shard.count}`
					: ""
			}`,
			shardID: this.client.shard?.ids[0] || undefined,
		});

		setTimeout(
			this.client.postTopggStats,
			100 * 60 * 30 // 30 minutes
		);
		this.client.postTopggStats();

		console.log(`[shard ${this.client.shard?.ids[0]}] I'm ready!`);

		!this.client.production &&
			console.log(
				`Add me to a guild with this URL: https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=${permissionsInt}&scope=bot%20applications.commands`
			);
	}
}
