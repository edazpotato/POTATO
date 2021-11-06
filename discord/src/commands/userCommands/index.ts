import { Collection, Interaction, MessageEmbed } from "discord.js";

import { ApplicationCommandType } from "../../misc/types";

const userCommands = new Collection<string, ApplicationCommandType>();

export { userCommands };
