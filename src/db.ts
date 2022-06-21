import { Sequelize } from "sequelize"
import { MkProject } from "./model/Project"

export const sequelize = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: "database.sqlite",
})

sequelize.sync()

export const Project = MkProject(sequelize)
