import { SlashCommandBuilder, inlineCode } from "@discordjs/builders";
import { Project } from "../db.js";
export const listCommandDefinition = {
    builder: new SlashCommandBuilder()
        .setName("list")
        .setDescription("Get a list of all the projects currently in tracking."),
    action: async (interaction) => {
        await interaction.deferReply();
        const projects = await Project.findAll({
            where: {
                guild_id: interaction.guild?.id,
            },
        });
        let list = "";
        for (const project of projects) {
            list += `**Title:** ${inlineCode(project.getDataValue("project_title"))} | **ID:** ${inlineCode(project.getDataValue("project_id"))} | **Updates Channel:** ${interaction.guild?.channels.cache.find(element => element.id === project.getDataValue("post_channel"))}\n`;
        }
        const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
        list = trim(list, 1900);
        return await interaction.editReply(list === "" ?
            `No projects are currently in tracking. Add some by using the ${inlineCode("/track")} command or by clicking the "Track Project" button when using the ${inlineCode("/search")} command.` :
            `List of Modrinth projects currently in tracking:\n${list}`);
    }
};
//# sourceMappingURL=list.js.map