import { SlashCommandBuilder } from "@discordjs/builders"
import { ChannelType } from "discord-api-types/v10"
import { Permissions, CommandInteraction, ButtonInteraction, CommandInteractionOption, Constants } from "discord.js"
import { CommandDefinition } from "../commands.js"
import { Project } from "../db.js"

export const trackProject = async (interaction: CommandInteraction | ButtonInteraction, postChannel: NonNullable<CommandInteractionOption["channel"]>, projectId: string) => {
    if (!interaction.guild)
        return await interaction.reply("Interaction has no guild")
    
    await interaction.deferReply()

    const apiRequest = await fetch(`https://api.modrinth.com/v2/project/${projectId}`)
    const fetchedProject = await apiRequest.json()

    const [_, created] = await Project.findOrCreate({
        where: {
            project_id: fetchedProject.id,
            guild_id: interaction.guild.id,
        },
        defaults: {
            project_id: fetchedProject.id,
            project_type: fetchedProject.project_type,
            project_slug: fetchedProject.slug,
            project_title: fetchedProject.title,
            date_modified: fetchedProject.updated,
            guild_id: interaction.guild.id,
            post_channel: postChannel.id,
        },
    })

    return await interaction.editReply(created ?
        `Project **${fetchedProject.title}** added to tracking. Updates will be posted in ${postChannel}.` :
        `Project **${fetchedProject.title}** is already being tracked. To change which channel this project"s updates are posted in, untrack and re-track the project.`)
}

export const trackCommandDefinition: CommandDefinition = {
    builder: new SlashCommandBuilder()
        .setName("track")
        .setDescription("Track a Modrinth project and get notified when it gets updated.")
        .addStringOption(option =>
            option
                .setName("project_id")
                .setDescription("Specify the project to track by its ID")
                .setRequired(true),
        )
        .addChannelOption(option =>
            option
                .setName("notification_channel")
                .setDescription("Specify which channel you want project update notifications posted to.")
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildNews)
                .setRequired(true),
        ),
    action: async (interaction: CommandInteraction) => {
        if (!interaction.memberPermissions || !interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
            return await interaction.reply({ content: "You can only add projects to tracking if you have the \"Manage Channels\" permission.", ephemeral: true })
    
        await interaction.deferReply()
        await trackProject(interaction, interaction.options.getChannel("notification_channel", true), interaction.options.getString("project_id", true))
    }
}
