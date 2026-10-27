import express, { type Express } from "express";
import cors from "cors";

import CategoryRoutes from "@controllers/category/routes/index.js";
import ProductRoutes from "@controllers/product/routes/index.js";
import { serverConfig } from "@config/serverConfig.js";

const app: Express = express();

app.use(cors({
    origin: serverConfig.cors.origin,
    methods: serverConfig.cors.methods
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(CategoryRoutes);
app.use(ProductRoutes);

app.use((req, res) => {
    res.status(404).send("Not Found");
});

export { app as AppServer };
