const { SlashCommandBuilder, inlineCode } = require('@discordjs/builders');
const { Projects } = require('../dbObjects');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('Get a list of all the projects currently in tracking.'),
	async execute(interaction) {
		const projects = await Projects.findAll({
			where: {
				guild_id: interaction.guild.id,
			},
		});

		let list = '';
		for (const project of projects) {
			list += `**Title:** ${inlineCode(project.project_title)} | **ID:** ${inlineCode(project.project_id)} | **Updates Channel:** ${interaction.guild.channels.cache.find(element => element.id === project.post_channel)}\n`;
		}

		if (list === '') return await interaction.reply(`No projects are currently in tracking. Add some by using the ${inlineCode('/track')} command or by clicking the "Track Project" button when using the ${inlineCode('/search')} command.`);

		await interaction.reply(`List of Modrinth projects currently in tracking:\n${list}`);
	},
};