import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "notification-service",
    brokers: ["kafka1:9092", "kafka2:9093"]
});

const consumer = kafka.consumer({ groupId: "notification-service" });

export { consumer };