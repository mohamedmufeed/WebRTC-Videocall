import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = (url: string): Socket | null => {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socket) {
      socket = io(url);
      socket.on("connect", () => setConnected(true));
    }
    socketRef.current = socket;

    return () => {
      // socket?.disconnect();
    };
  }, [url]);

  return connected ? socketRef.current : null; 
};
