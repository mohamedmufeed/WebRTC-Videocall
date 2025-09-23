import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"

const app = express()
const httpServer = createServer(app)


const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true, 
  },
});

// Connection
io.on("connection", (socket) => {
    console.log("A user connected :", socket.id)

    // Join a room
    socket.on("join-room", (roomId: string) => {
        socket.join(roomId)
        console.log(`${socket.id} joined room ${roomId}`)
        socket.to(roomId).emit("user-joined", socket.id)
    })

    // Forward offer
    socket.on("offer", (data: { offer: any, to: string }) => {
        io.to(data.to).emit("offer", { offer: data.offer, from: socket.id })
    })

    // Forward answer
    socket.on("answer", (data: { answer: any, to: string }) => {
        io.to(data.to).emit("answer", { answer: data.answer, from: socket.id })
    })

    // Forward ICE candidates
    socket.on("ice-candidate", (data: { candidate: any, to: string }) => {
        io.to(data.to).emit("ice-candidate", { candidate: data.candidate, from: socket.id })
    })

    // Disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    })

})

httpServer.listen(5001, () => {
    console.log("Server listening on port 5001");
})