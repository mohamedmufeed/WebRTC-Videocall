import type React from "react";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";

interface Props {
    roomId: string;
    userId: string;
    socket: Socket | null

}

interface Message {
    userId: string;
    text: string;
    timestamp: number
}

const Chat: React.FC<Props> = ({ roomId, userId, socket }) => {

    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    useEffect(() => {
        if (!socket) return
        socket.emit("join-room", roomId);
        const handleReceive = (msg: Message) => {
            setMessages((prev) => [...prev, msg])
        }

        socket.on("receive-message", handleReceive);

        return () => {
            socket.off("receive-message", handleReceive)
        }
    }, [socket, roomId])

    const sendMessage = () => {
        if (input.trim() === "" || !socket) return
        const msg: Message = {
            userId,
            text: input,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, msg]);
        socket.emit("send-message", { roomId, msg });
        setInput("");

    }
    return (
        <div className="w-full lg:w-1/3 bg-white/60 p-6 flex flex-col  rounded-lg shadow-inner">
            {/* Chat Heading */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Chat</h2>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2">
                {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`flex w-full ${msg.userId === userId ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`p-3 rounded-xl w-fit max-w-[80%] shadow-sm ${msg.userId === userId
                                        ? "bg-[#695ca8]/50 text-right"
                                        : "bg-gray-100 text-left"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>

                    ))
                ) :
                    (
                        <p className="text-gray-500 text-center">No Messages</p>
                    )}
            </div>

            <div className="mt-4 flex gap-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-white text-black px-5 py-2 rounded-xl hover:bg-gray-200 transition">
                    Send
                </button>
            </div>
        </div>
    )
}

export default Chat