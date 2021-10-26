import { Collection, Interaction, MessageEmbed } from "discord.js";

import { ApplicationCommandType } from "../../types";

const messageCommands = new Collection<string, ApplicationCommandType>();

export { messageCommands };
