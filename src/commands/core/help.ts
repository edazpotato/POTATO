import { Command as AkairoCommand, Category } from "discord-akairo";
import { Client, Command, Language, Message } from "../../structures";
import { MessageEmbed, PermissionString } from "discord.js";

function capitilize(name: string) {
	return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

const usefulLinks = [
	{ name: "Website", url: "https://potato.edaz.codes" },
	{ name: "Support server", url: "https://discord.gg/mzR7eeZ" },
];

export default class HelpCommand extends Command {
	declare client: Client;

	constructor() {
		super("help", {
			description: (language: Language) => ({
				usage: language.getString("COMMAND_HELP_USAGE"),
				about: language.getString("COMMAND_HELP_DESCRIPTION"),
			}),
			category: "Core",
			aliases: ["help", "h", "command", "usage"],
			clientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
			args: [{ id: "command", type: "command", default: null }],
		});
	}

	async exec(message: Message, { command }: { command: Command }) {
		if (command === null) {
			let suitablePrefix = this.client.defaultCommandPrefix;
			// if (message.guild) {
			// 	suitablePrefix = message.guild.settings.prefix;
			// }

			// console.log(suitablePrefix);

			const embed = new MessageEmbed().setFooter(
				message.language.getString(
					"COMMAND_HELP_EMBED_FOOTER",
					!!message.guild,
					suitablePrefix
				)
			);

			let categories = [];

			for (const [id, category] of this.client.commandHandler
				.categories) {
				categories.push(category);
			}

			embed.addFields(
				categories.map((c) => ({
					name: capitilize(
						c.id ||
							message.language.getString(
								"COMMAND_HELP_EMBED_FIELD_UNKNOWN_CATEGORY_NAME"
							)
					),
					value: c
						.filter((command: AkairoCommand) => {
							if (
								command.ownerOnly &&
								!this.client.isOwner(message.author.id)
							)
								return false;

							if (command.channel == "guild" && !message.guild)
								return false;

							return true;
						})
						.map(
							(command: AkairoCommand, key: string) =>
								`\`${key}\``
						)
						.join(", "),
				}))
			);

			embed.addField(
				message.language.getString(
					"COMMAND_HELP_EMBED_FIELD_USEFUL_LINKS_NAME"
				),
				usefulLinks
					.map((link) => `[${link.name}](${link.url})`)
					.join(" - ")
			);

			return message.util.send({ embeds: [embed] });
		} else {
			const embed = new MessageEmbed()
				.setTitle(capitilize(command.id))
				.setFooter(
					message.language.getString(
						"COMMAND_HELP_EMBED_DETAILS_FOOTER"
					)
				);

			if (command.description && message.util.parsed) {
				const description = command.description(message.language);
				if (description.usage) {
					embed.addField(
						message.language.getString(
							"COMMAND_HELP_EMBED_DETAILS_FIELD_USAGE_NAME"
						),
						`\`${message.util.parsed.prefix}${command.id} ${description.usage}\``
					);
				}
				if (description.about) {
					embed.setDescription(description.about);
				}
			}
			if (command.userPermissions) {
				embed.addField(
					message.language.getString(
						"COMMAND_HELP_EMBED_DETAILS_FIELD_USER_PERMISSIONS_NAME"
					),
					(command.userPermissions as PermissionString[])
						.map((permission: PermissionString) =>
							message.language.getString(
								"PERMISSIONS",
								permission
							)
						)
						.join(", ")
				);
			}
			if (command.clientPermissions) {
				embed.addField(
					message.language.getString(
						"COMMAND_HELP_EMBED_DETAILS_FIELD_CLIENT_PERMISSIONS_NAME"
					),
					"`" +
						(command.clientPermissions as PermissionString[])
							.map((permission: PermissionString) =>
								message.language.getString(
									"PERMISSIONS",
									permission
								)
							)
							.join("`, `") +
						"`"
				);
			}

			return message.util.send({ embeds: [embed] });
		}
	}
}
