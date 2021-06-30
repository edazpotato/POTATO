import {
	Command as AkairoCommand,
	CommandOptions as AkairoCommandOptions,
	ArgumentMatch,
	ArgumentType
} from "discord-akairo";

import { Client } from ".";
import Language from "./Language";

/* This is very hacky. Shut up. */

interface CommandOptions extends Omit<AkairoCommandOptions, "description"> {
	description?: (language: Language) => { about?: string; usage?: string };
}

export default class Command extends AkairoCommand {
	declare client: Client;

	constructor(id: string, options: CommandOptions = {}) {
		super(id, options as AkairoCommandOptions);
	}
}
