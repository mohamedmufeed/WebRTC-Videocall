import { Server, Socket } from "socket.io";
import { Message } from "./types/types";

const rooms = new Map<string, Set<string>>();

export const initializeSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join-room", (roomId: string) => {
            if (!rooms.has(roomId)) rooms.set(roomId, new Set());

            const room = rooms.get(roomId)!;
            const existingUsers = Array.from(room);

            room.add(socket.id);
            socket.join(roomId);

            console.log(`${socket.id} joined room ${roomId}. Users in room:`, Array.from(room));
            existingUsers.forEach(userId => io.to(userId).emit("user-joined", socket.id));
            existingUsers.forEach(userId => socket.emit("user-joined", userId));
        });

        socket.on("send-message", (data: { roomId: string; msg: Message }) => {
            socket.to(data.roomId).emit("receive-message", data.msg);
        });

        socket.on("offer", (data: { offer: any; to: string }) => {
            io.to(data.to).emit("offer", { offer: data.offer, from: socket.id });
        });

        socket.on("answer", (data: { answer: any; to: string }) => {
            io.to(data.to).emit("answer", { answer: data.answer, from: socket.id });
        });

        socket.on("ice-candidate", (data: { candidate: any; to: string }) => {
            io.to(data.to).emit("ice-candidate", { candidate: data.candidate, from: socket.id });
        });

        socket.on("leave-room", (roomId: string) => {
            const room = rooms.get(roomId);
            if (!room) return;

            room.delete(socket.id);
            socket.leave(roomId);
            socket.to(roomId).emit("user-left", socket.id);

            if (room.size === 0) {
                rooms.delete(roomId);
                console.log(`Room ${roomId} deleted (empty)`);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            for (const [roomId, room] of rooms.entries()) {
                if (room.has(socket.id)) {
                    room.delete(socket.id);
                    socket.to(roomId).emit("user-left", socket.id);

                    if (room.size === 0) rooms.delete(roomId);
                }
            }
        });

        socket.on("connect_error", (err) => console.error(`Socket error ${socket.id}:`, err.message));
        socket.on("reconnect_attempt", (attempt) => console.log(`Socket ${socket.id} reconnect attempt ${attempt}`));
    });
};
