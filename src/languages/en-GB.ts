import { Client, Language } from "../structures";

export default class enGB extends Language {
	constructor() {
		super("en-GB", {
			STRING_NOT_FOUND: (client: Client, key: string) =>
				`[en-GB (default)] No string found that matches ${key}`,
			COMMAND_PING_EMBED_TITLE: "Pong!",
			COMMAND_PING_EMBED_FIELD_RTT_TITLE: "Round trip time",
			COMMAND_PING_EMBED_FIELD_HEARTBEAT_TITLE: "Heartbeat",
			ERROR_MESSAGE: (client: Client, msg: string) =>
				`<:no:713222233627164673> ${msg}`,
			SUCCESS_MESSAGE: (client: Client, msg: string) =>
				`<:yes:713222234365231225> ${msg}`,
			PERMISSIONS: (client: Client, key: string) =>
				({
					// Taken from https://github.com/FireDiscordBot/bot/blob/dbb635e59e0a8dd73ac11bbb2885e611cf0c182b/src/languages/en-US.ts#L189 because I'm lazy
					// If possible, use the translations from the Discord client here
					CREATE_INSTANT_INVITE: "Create Invite",
					KICK_MEMBERS: "Kick Members",
					BAN_MEMBERS: "Ban Members",
					ADMINISTRATOR: "Administrator",
					MANAGE_CHANNELS: "Manage Channels",
					MANAGE_GUILD: "Manage Server",
					ADD_REACTIONS: "Add Reactions",
					VIEW_AUDIT_LOG: "View Audit Log",
					PRIORITY_SPEAKER: "Priority Speaker",
					STREAM: "Video",
					VIEW_CHANNEL: "Read Messages",
					SEND_MESSAGES: "Send Messages",
					SEND_TTS_MESSAGES: "Send TTS Messages",
					MANAGE_MESSAGES: "Manage Messages",
					EMBED_LINKS: "Embed Links",
					ATTACH_FILES: "Attach Files",
					READ_MESSAGE_HISTORY: "Read Message History",
					MENTION_EVERYONE:
						"Mention @\u200beveryone, @\u200bhere and All Roles",
					USE_EXTERNAL_EMOJIS: "Use External Emojis",
					VIEW_GUILD_INSIGHTS: "View Server Insights",
					CONNECT: "Connect",
					SPEAK: "Speak",
					MUTE_MEMBERS: "Mute Members (voice)",
					DEAFEN_MEMBERS: "Deafen Members",
					MOVE_MEMBERS: "Move Members",
					USE_VAD: "Use Voice Activity",
					CHANGE_NICKNAME: "Change Nickname",
					MANAGE_NICKNAMES: "Manage Nicknames",
					MANAGE_ROLES: "Manage Roles",
					MANAGE_WEBHOOKS: "Manage Webhooks",
					MANAGE_EMOJIS: "Manage Emojis"
				}[key])
		});
	}
}
