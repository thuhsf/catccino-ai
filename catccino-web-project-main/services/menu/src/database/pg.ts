import { dbEnvConfig } from "@config/dbConfig.js";
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
	host: dbEnvConfig.host,
	user: dbEnvConfig.user,
	password: dbEnvConfig.password,
	database: dbEnvConfig.database,
	port: dbEnvConfig.port
});