import * as fs from "node:fs"

import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"

require("dotenv")()
const { GUILD_IDS, CLIENT_ID, BOT_TOKEN } = process.env

const commands = []
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"))

for (const file of commandFiles) {
	const command = require(`./commands/${file}`)
	commands.push(command.data.toJSON())
}

const rest = new REST({ version: "9" }).setToken(BOT_TOKEN)

(async () => {
	try {
		console.log("Started reloading application slash commands.")

		for (const guildId of GUILD_IDS.split(",")) {
			await rest.put(
				Routes.applicationGuildCommands(CLIENT_ID, guildId),
				{ body: commands },
			)
		}

		console.log("Successfully reloaded application slash commands.")
	} catch (error) {
		console.error(error)
	}
})()