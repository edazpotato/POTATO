import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
	constructor() {
		super("ready", {
			emitter: "client",
			event: "ready"
		});
	}

	exec() {
		console.log(`[shard ${this.client.shard?.ids[0]}] I'm ready!`);
	}
}
