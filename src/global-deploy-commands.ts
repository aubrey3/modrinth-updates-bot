import * as fs from "node:fs"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { config } from "dotenv"
import { commands } from "./command"

config()
const { CLIENT_ID, BOT_TOKEN } = process.env

const rest = new REST({ version: "9" }).setToken(BOT_TOKEN)

;(async () => {
    try {
        console.log("Started globally reloading application slash commands.")

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        )

        console.log("Successfully globally reloaded application slash commands.")
    } catch (e) {
        console.error(e)
    }
})()
