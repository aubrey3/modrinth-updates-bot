import { Permissions, Interaction } from "discord.js"
import { trackProject } from "../commands/track"

module.exports = {
	name: "interactionCreate",
	async execute(interaction: Interaction) {
		// Slash command interactions
		if (interaction.isCommand()) {
			const command = interaction.client.commands.get(interaction.commandName)

			if (!command) return

			try {
				command.execute(interaction)
			} catch (error) {
				console.error(error)
				await interaction.reply({ content: "There was an error while executing this command.", ephemeral: true })
			}
		} else if (interaction.isButton()) {
			if (interaction.customId.startsWith("track:")) {
				if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS))
					return await interaction.reply({ content: "You can only add projects to tracking if you have the \"Manage Channels\" permission.", ephemeral: true })

				const projectId = interaction.customId.substring(6)
				await interaction.deferReply()
				trackProject(interaction, interaction.guild.channels.cache.find(element => element.id === interaction.channel.id), projectId)
			}
		}
	},
}
