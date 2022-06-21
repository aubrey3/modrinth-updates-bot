import { SlashCommandBuilder } from "@discordjs/builders"
import { Collection } from "discord.js"
import * as list from "./command/list"
import * as search from "./command/search"
import * as track from "./command/track"
import * as untrack from "./command/untrack"

export type CommandDefinition = {
    data: SlashCommandBuilder
    execute: () => void
}

export const commands = [list, search, track, untrack]
export const commandMap = { list, search, track, untrack }
