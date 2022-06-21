import { SlashCommandBuilder } from "@discordjs/builders";
import { Permissions } from "discord.js";
import { Project } from "../db.js";
export const trackProject = async (interaction, postChannel, projectId) => {
    const apiRequest = await fetch(`https://api.modrinth.com/v2/project/${projectId}`);
    const fetchedProject = await apiRequest.json();
    if (!interaction.guild)
        return await interaction.editReply("Interaction has no guild");
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
    });
    return await interaction.editReply(created ?
        `Project **${fetchedProject.title}** added to tracking. Updates will be posted in ${postChannel}.` :
        `Project **${fetchedProject.title}** is already being tracked. To change which channel this project"s updates are posted in, untrack and re-track the project.`);
};
export const trackCommandDefinition = {
    builder: new SlashCommandBuilder()
        .setName("track")
        .setDescription("Track a Modrinth project and get notified when it gets updated.")
        .addStringOption(option => option
        .setName("project_id")
        .setDescription("Specify the project to track by its ID")
        .setRequired(true))
        .addChannelOption(option => option
        .setName("notification_channel")
        .setDescription("Specify which channel you want project update notifications posted to.")
        .addChannelTypes(0, 5)
        .setRequired(true)),
    action: async (interaction) => {
        if (!interaction.memberPermissions || !interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
            return await interaction.reply({ content: "You can only add projects to tracking if you have the \"Manage Channels\" permission.", ephemeral: true });
        await interaction.deferReply();
        await trackProject(interaction, interaction.options.getChannel("notification_channel", true), interaction.options.getString("project_id", true));
    }
};
//# sourceMappingURL=track.js.map