import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { initializeSocket } from "./sokcet"
import dotenv from "dotenv";
dotenv.config()
const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONT_END_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

initializeSocket(io)

httpServer.listen(5001, () => {
    console.log("Server listening on port 5001");
})