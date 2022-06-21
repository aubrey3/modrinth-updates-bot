import * as fs from "node:fs"
import { Client, Intents } from "discord.js"
import { config } from "dotenv"
import { events } from "./event"

config()
const { BOT_TOKEN } = process.env

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

for (const event of events) {
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.login(BOT_TOKEN)
