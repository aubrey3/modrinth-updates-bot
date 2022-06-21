import { Projects } from "./../dbObjects"
import { MessageEmbed, Client } from "discord.js"

module.exports = {
	name: "ready",
	async execute(client: Client) {
		console.log(`Bot online, logged in as ${client.user.tag}`)

		// 10m = 600,000ms
		doUpdateCheck()
		setInterval(doUpdateCheck, 600000)

		async function doUpdateCheck() {
			console.log("Checking for updates for projects in tracking...")

			const projects = await Projects.findAll()
			const guilds = client.guilds.cache.clone()

			for (const project of projects) {
				try {
					const apiRequest = await fetch(`https://api.modrinth.com/v2/project/${project.project_id}`)
					var fetchedProject = await apiRequest.json()
				} catch (error) {
					console.error(error)
					continue
				}

				const fetchedProjectUpdatedDate = new Date(fetchedProject.updated)
				if (project.date_modified.getTime() === fetchedProjectUpdatedDate.getTime()) continue

				console.log(`Update detected for project: ${fetchedProject.title}`)
				await Projects.update({ date_modified: fetchedProject.updated },
					{
						where: {
							project_id: fetchedProject.id,
						},
					})

				for (let i = 0; i < guilds.size; i++) {
					const guild = guilds.at(i)
					if (guild.id === project.guild_id) {
						sendUpdateMessage(project, fetchedProject, guild)
					}
				}
			}
		}

		async function sendUpdateMessage(project, fetchedProject, guild) {
			const apiRequest = await fetch(`https://api.modrinth.com/v2/project/${fetchedProject.id}/version`)
			const fetchedVersion = await apiRequest.json()

			const update = new MessageEmbed()
				.setColor("DARK_GREEN")
				.setTitle(`${fetchedProject.title} has been updated`)
				.setDescription(`A new version is available for ${fetchedProject.title}.`)
				.setThumbnail(`${fetchedProject.icon_url}`)
				.setFields(
					{ name: "Version Name", value: `${fetchedVersion[0].name}` },
					{ name: "Version Number", value: `${fetchedVersion[0].version_number}` },
					{ name: "Release Type", value: `${fetchedVersion[0].version_type}` },
					{ name: "Date Published", value: `${fetchedVersion[0].date_published}` },
				)
				.setTimestamp()
			await guild.channels.cache.find(element => element.id === project.post_channel).send({ embeds: [ update ] })
		}
	},
}