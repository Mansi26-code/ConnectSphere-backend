import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);

// ✅ CORS CONFIGURATION ADDED
app.use(cors({
    origin: "https://connect-sphere-frontend-alpha.vercel.app/",  // Yahan "*" hai, but specific frontend domain dena better hoga
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);
app.get("/", (req, res) => {
    res.send("Server is working fine");
  });

const start = async () => {
    try {
        app.set("mongo_user");
        const connectionDb = await mongoose.connect("mongodb+srv://mansiswaraj26:mansi19%40%23%24@cluster1.arw9e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1");

        console.log(`✅ MONGO Connected DB Host: ${connectionDb.connection.host}`);

        server.listen(app.get("port"), () => {
            console.log(`🚀 Server running on PORT ${app.get("port")}`);
        });

    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1);  // Fail hone par process exit kar dega
    }
}

start();
