import { Collection, Interaction, MessageEmbed } from "discord.js";

import { ApplicationCommandType } from "../../types";

const userCommands = new Collection<string, ApplicationCommandType>();

export { userCommands };
