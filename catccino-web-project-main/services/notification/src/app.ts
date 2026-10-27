import express, { type Express } from "express";
import cors from "cors";

import NotificationRoutes from "@controllers/notification/routes/index.js";
import { serverConfig } from "@config/serverConfig.js";

const app: Express = express();

app.use(cors({
    origin: serverConfig.cors.origin,
    methods: serverConfig.cors.methods
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(NotificationRoutes);

app.use((req, res) => {
    res.status(404).send("Not Found");
});

export { app as AppServer };
