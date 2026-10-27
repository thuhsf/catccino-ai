import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "order-service",
    brokers: ["kafka1:9092", "kafka2:9093"]
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "order-service" });

export { producer, consumer };