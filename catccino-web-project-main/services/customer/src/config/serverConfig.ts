import config from "../../config.json" with { type: "json" }

type ServerConfig = typeof config;
export const serverConfig: ServerConfig = config