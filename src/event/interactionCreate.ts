import { Permissions, Interaction } from "discord.js"
import { trackProject } from "../command/track"
import { commandMap } from "../command"

export const name = "interactionCreate"

export const once = false

export const execute = async (interaction: Interaction) => {
    // Slash command interactions
    if (interaction.isCommand()) {
        const command = commandMap[interaction.commandName]

        if (!command) return

        try {
            command.execute(interaction)
        } catch (e) {
            console.error(e)
            await interaction.reply({ content: "There was an error while executing this command.", ephemeral: true })
        }
    } else if (interaction.isButton()) {
        if (interaction.customId.startsWith("track:")) {
            if (!interaction.memberPermissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
                return await interaction.reply({ content: "You can only add projects to tracking if you have the \"Manage Channels\" permission.", ephemeral: true })

            const projectId = interaction.customId.substring(6)
            await interaction.deferReply()
            trackProject(interaction, interaction.guild.channels.cache.find(element => element.id === interaction.channel.id), projectId)
        }
    }
}
