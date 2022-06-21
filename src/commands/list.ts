import { SlashCommandBuilder, inlineCode } from "@discordjs/builders"
import { CommandInteraction } from "discord.js"
import { Projects } from "../dbObjects"

export default {
	data: new SlashCommandBuilder()
		.setName("list")
		.setDescription("Get a list of all the projects currently in tracking."),
	async execute(interaction: CommandInteraction) {
		await interaction.deferReply()
		const projects = await Projects.findAll({
			where: {
				guild_id: interaction.guild.id,
			},
		})

		let list = ""
		for (const project of projects) {
			list += `**Title:** ${inlineCode(project.project_title)} | **ID:** ${inlineCode(project.project_id)} | **Updates Channel:** ${interaction.guild.channels.cache.find(element => element.id === project.post_channel)}\n`
		}

		const trim = (str: string, max: number) => (str.length > max ? `${str.slice(0, max - 3)}...` : str)
		list = trim(list, 1900)

		if (list === "") return await interaction.reply(`No projects are currently in tracking. Add some by using the ${inlineCode("/track")} command or by clicking the "Track Project" button when using the ${inlineCode("/search")} command.`)

		await interaction.editReply(`List of Modrinth projects currently in tracking:\n${list}`)
	},
}
