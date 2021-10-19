import messageCommands from "./messageCommands";
import slashCommands from "./slashCommands";
import userCommands from "./userCommands";

const contextMenuCommands = [...messageCommands, ...userCommands];

export { slashCommands, contextMenuCommands };
