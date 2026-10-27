import { createClient, type RedisClientType } from "redis";

const client: RedisClientType = createClient({
    url: String(process.env.REDIS_URL) ?? "redis://localhost:6379"
});

client.on("error", (err) => console.error("Erro no redis", err));
client.on("connect", () => console.log("Redis conectado"));


await client.connect();

export default client;