import { listCommandDefinition } from "./command/list.js";
import { searchCommandDefinition } from "./command/search.js";
import { trackCommandDefinition } from "./command/track.js";
import { untrackCommandDefinition } from "./command/untrack.js";
export const commands = [
    listCommandDefinition,
    searchCommandDefinition,
    trackCommandDefinition,
    untrackCommandDefinition
];
export const commandMap = Object.fromEntries(commands.map(command => [command.builder.name, command]));
//# sourceMappingURL=commands.js.map