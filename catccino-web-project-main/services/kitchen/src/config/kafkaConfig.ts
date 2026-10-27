import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "kitchen-service",
    brokers: ["kafka1:9092", "kafka2:9093"]
});

const consumer = kafka.consumer({ groupId: "kitchen-service" });

export { consumer };