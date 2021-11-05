import { Collection, Interaction, Message, MessageEmbed } from "discord.js";

import { DatabaseType } from "../../misc/types";

const buttonHandlers = new Collection<
	string,
	(interaction: Interaction, db: DatabaseType) => Promise<any>
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
	return interaction.message.edit({
		embeds: [
			new MessageEmbed()
				.setColor("RED")
				.setDescription("Action canceled."),
		],
		components: [],
	});
});
buttonHandlers.set("delete_guild_data", async (interaction, db) => {
	if (!interaction.isButton()) return;
	if (interaction.user.id !== interaction.message.interaction?.user.id)
		return interaction.reply({
			content: "This button isn't for you!",
			ephemeral: true,
		});
	if (!(interaction.message instanceof Message) || !interaction.guild)
		return interaction.reply({
			content: "Something has gone terribly wrong!",
			ephemeral: true,
		});

	await interaction.message.edit({
		embeds: [
			new MessageEmbed()
				.setColor("RED")
				.setDescription(
					"All the data that I have stored about this guild is now being deleted.",
				),
		],
		components: [],
	});
	await db.run("DELETE FROM guilds WHERE discord_id=$id", {
		$id: interaction.guild.id,
	});
	await db.run(
		"UPDATE stats_bot_command_invocations SET guild_id=NULL WHERE guild_id=$id",
		{
			$id: interaction.guild.id,
		},
	);
	return;
});

export { buttonHandlers };
