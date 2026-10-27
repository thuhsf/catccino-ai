// config/kafkaConfig.ts
import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "menu-service",
    brokers: ["kafka1:9092", "kafka2:9093"]
});

const consumer = kafka.consumer({ groupId: "menu-service" });

export { consumer };