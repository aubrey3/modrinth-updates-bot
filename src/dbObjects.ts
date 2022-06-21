import { Sequelize } from "sequelize"
import Project from "./models/Project"

const sequelize = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "database.sqlite",
})

export const Projects = Project(sequelize)
