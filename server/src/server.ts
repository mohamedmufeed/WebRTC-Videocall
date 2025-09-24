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

// Store room information
const rooms = new Map<string, Set<string>>();

// Connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id)

    // Join a room
    socket.on("join-room", (roomId: string) => {
        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }

        const room = rooms.get(roomId)!;
        const existingUsers = Array.from(room);
        
        // Add current user to room
        room.add(socket.id);
        socket.join(roomId);
        
        console.log(`${socket.id} joined room ${roomId}. Users in room:`, Array.from(room));

        // Notify existing users about the new user
        existingUsers.forEach(userId => {
            io.to(userId).emit("user-joined", socket.id);
        });

        // Send existing users to the new user
        existingUsers.forEach(userId => {
            socket.emit("user-joined", userId);
        });
    })

    // Forward offer
    socket.on("offer", (data: { offer: any, to: string }) => {
        console.log(`Forwarding offer from ${socket.id} to ${data.to}`);
        io.to(data.to).emit("offer", { offer: data.offer, from: socket.id });
    })

    // Forward answer
    socket.on("answer", (data: { answer: any, to: string }) => {
        console.log(`Forwarding answer from ${socket.id} to ${data.to}`);
        io.to(data.to).emit("answer", { answer: data.answer, from: socket.id });
    })

    // Forward ICE candidates
    socket.on("ice-candidate", (data: { candidate: any, to: string }) => {
        console.log(`Forwarding ICE candidate from ${socket.id} to ${data.to}`);
        io.to(data.to).emit("ice-candidate", { candidate: data.candidate, from: socket.id });
    })

    // Leave room
    socket.on("leave-room", (roomId: string) => {
        const room = rooms.get(roomId);
        if (room) {
            room.delete(socket.id);
            socket.leave(roomId);
            
            // Notify other users in the room
            socket.to(roomId).emit("user-left", socket.id);
            
            console.log(`${socket.id} left room ${roomId}`);
            
            // Clean up empty rooms
            if (room.size === 0) {
                rooms.delete(roomId);
                console.log(`Room ${roomId} deleted (empty)`);
            }
        }
    })

    // Disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        
        // Remove user from all rooms
        for (const [roomId, room] of rooms.entries()) {
            if (room.has(socket.id)) {
                room.delete(socket.id);
                
                // Notify other users in the room
                socket.to(roomId).emit("user-left", socket.id);
                
                // Clean up empty rooms
                if (room.size === 0) {
                    rooms.delete(roomId);
                    console.log(`Room ${roomId} deleted (empty)`);
                }
            }
        }
    })
})

httpServer.listen(5001, () => {
    console.log("Server listening on port 5001");
})