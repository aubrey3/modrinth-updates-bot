import { interactionCreateEventDefinition } from "./event/interactionCreate.js";
import { readyEventDefinition } from "./event/ready.js";
export const eventDefinitions = [
    interactionCreateEventDefinition,
    readyEventDefinition
];
export const registerEvents = (client) => {
    for (const eventDefinition of eventDefinitions)
        (eventDefinition.once ? client.once.bind(client) : client.on.bind(client))(eventDefinition.name, eventDefinition.listener);
};
//# sourceMappingURL=events.js.map