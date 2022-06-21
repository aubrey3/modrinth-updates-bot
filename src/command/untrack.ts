import { SlashCommandBuilder } from "@discordjs/builders"
import { Permissions, CommandInteraction } from "discord.js"
import { Project } from "../db"

export const data = new SlashCommandBuilder()
    .setName("untrack")
    .setDescription("Remove a project from tracking.")
    .addStringOption(option =>
        option
            .setName("projectid")
            .setDescription("Enter the project by ID which you want to untrack")
            .setRequired(true),
    )

export const execute = async (interaction: CommandInteraction) => {
    if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
        return await interaction.reply({ content: "You can only remove projects from tracking if you have the \"Manage Channels\" permission.", ephemeral: true })
    
    const projectId = interaction.options.getString("projectid")

    const deleted = await Project.destroy({
        where: {
            project_id: projectId,
            guild_id: interaction.guild.id,
        },
    })

    return await interaction.reply(deleted ?
        "Project has been removed from tracking." :
        "That project is not being tracked, therefore you cannot untrack it.")
}
