import { Collection, Interaction, Message, MessageEmbed } from "discord.js";

import { DatabaseType } from "../../types";

const buttonHandlers = new Collection<
	string,
	(interaction: Interaction, db: DatabaseType) => Promise<void>
>();

buttonHandlers.set("cancel", async (interaction) => {
	if (!interaction.isButton()) return;
	if (interaction.user.id !== interaction.message.interaction?.user.id)
		return interaction.reply({
			content: "This button isn't for you!",
			ephemeral: true,
		});
	if (!(interaction.message instanceof Message))
		return interaction.reply({
			content: "Something has gone terribly wrong!",
			ephemeral: true,
		});
	interaction.message.edit({
		embeds: [
			new MessageEmbed()
				.setColor("RED")
				.setDescription("Action canceled."),
		],
		components: [],
	});
});

export { buttonHandlers };
