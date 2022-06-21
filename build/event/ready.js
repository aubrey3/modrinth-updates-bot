import { MessageEmbed } from "discord.js";
import { Project } from "../db.js";
export const readyEventDefinition = {
    once: false,
    name: "ready",
    listener: async (client) => {
        console.log(`Bot online, logged in as ${client.user?.tag}`);
        const sendUpdateMessage = async (project, fetchedProject, guild) => {
            const apiRequest = await fetch(`https://api.modrinth.com/v2/project/${fetchedProject.id}/version`);
            const fetchedVersion = await apiRequest.json();
            const update = new MessageEmbed()
                .setColor("DARK_GREEN")
                .setTitle(`${fetchedProject.title} has been updated`)
                .setDescription(`A new version is available for ${fetchedProject.title}.`)
                .setThumbnail(`${fetchedProject.icon_url}`)
                .setFields({ name: "Version Name", value: `${fetchedVersion[0].name}` }, { name: "Version Number", value: `${fetchedVersion[0].version_number}` }, { name: "Release Type", value: `${fetchedVersion[0].version_type}` }, { name: "Date Published", value: `${fetchedVersion[0].date_published}` })
                .setTimestamp();
            const channel = guild.channels.cache.find(element => element.id === project.getDataValue("post_channel"));
            if (channel?.isText() || channel?.isThread())
                channel.send({ embeds: [update] });
        };
        const doUpdateCheck = async () => {
            console.log("Checking for updates for projects in tracking...");
            const projects = await Project.findAll();
            const guilds = client.guilds.cache.clone();
            for (const project of projects) {
                try {
                    const apiRequest = await fetch(`https://api.modrinth.com/v2/project/${project.getDataValue("project_id")}`);
                    var fetchedProject = await apiRequest.json();
                }
                catch (error) {
                    console.error(error);
                    continue;
                }
                const fetchedProjectUpdatedDate = new Date(fetchedProject.updated);
                if (project.getDataValue("date_modified").getTime() === fetchedProjectUpdatedDate.getTime())
                    continue;
                console.log(`Update detected for project: ${fetchedProject.title}`);
                await Project.update({ date_modified: fetchedProject.updated }, {
                    where: {
                        project_id: fetchedProject.id,
                    },
                });
                for (let i = 0; i < guilds.size; i++) {
                    const guild = guilds.at(i);
                    if (guild?.id === project.getDataValue("guild_id")) {
                        sendUpdateMessage(project, fetchedProject, guild);
                    }
                }
            }
        };
        // 10m = 600,000ms
        doUpdateCheck();
        setInterval(doUpdateCheck, 600000);
    }
};
//# sourceMappingURL=ready.js.map