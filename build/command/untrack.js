import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";
import { Project } from "../db.js";
export const untrackCommandDefinition = {
    builder: new SlashCommandBuilder()
        .setName("untrack")
        .setDescription("Remove a project from tracking.")
        .addStringOption(option => option
        .setName("projectid")
        .setDescription("Enter the project by ID which you want to untrack")
        .setRequired(true)),
    action: async (interaction) => {
        if (!interaction.memberPermissions || !interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
            return await interaction.reply({ content: "You can only remove projects from tracking if you have the \"Manage Channels\" permission.", ephemeral: true });
        if (!interaction.guild)
            return await interaction.reply({ content: "Interaction has no guild", ephemeral: true });
        const projectId = interaction.options.getString("projectid", true);
        const deleted = await Project.destroy({
            where: {
                project_id: projectId,
                guild_id: interaction.guild.id,
            },
        });
        return await interaction.reply(deleted ?
            "Project has been removed from tracking." :
            "That project is not being tracked, therefore you cannot untrack it.");
    }
};
//# sourceMappingURL=untrack.js.map