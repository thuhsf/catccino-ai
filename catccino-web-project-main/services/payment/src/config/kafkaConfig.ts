import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "payment-service",
    brokers: ["kafka1:9092", "kafka2:9093"]
});

const producer = kafka.producer();

export { producer };