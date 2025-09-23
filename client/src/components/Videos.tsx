import type React from "react"
import { useEffect, useRef } from "react"
import { useSocket } from "../hooks/useSocket"


interface Props {
    roomId: string
}

const Videos: React.FC<Props> = ({ roomId }) => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const socket = useSocket("http://localhost:5001");

    useEffect(() => {
        if (!socket) return
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        const startLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                if (localVideoRef.current) localVideoRef.current.srcObject = stream
                stream.getTracks().forEach(track => pc.addTrack(track, stream))
            } catch (err) {
                console.error("Error accessing camera/microphone:", err)
            }
        }

        startLocalStream()

        pc.ontrack = (event) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0]
            }
        }

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", { candidate: event.candidate, to: remoteSocketId })
            }
        }
        let remoteSocketId: string | null = null;

        socket.emit("join-room", roomId)

        socket.on("user-joined", (id: string) => {
            remoteSocketId = id
            createOffer(id);
        })

        socket.on("offer", async ({ offer, from }: any) => {
            remoteSocketId = from
            await pc.setRemoteDescription(new RTCSessionDescription(offer))
            const answer = await pc.createAnswer()
            pc.setLocalDescription(answer)
            socket.emit("answer", { answer, to: from });
        })

        socket.on("answer", async ({ answer }: any) => {
            await pc.setRemoteDescription(new RTCSessionDescription(answer))
        })

        socket.on("ice-candidate", async ({ candidate }: any) => {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error("Error adding ICE candidate", e);
            }
        });


        const createOffer = async (id: string) => {
            const offer = await pc.createOffer()
            await pc.setLocalDescription(offer)
            socket.emit("offer", { offer, to: id });
        }
        return () => {
            pc.close();
            socket.off("user-joined");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
        };

    }, [roomId, socket])
    return (
        <>
            <video
                ref={localVideoRef}
                className="flex-1 rounded-lg border-2 border-white bg-black h-80 sm:h-96"
                autoPlay
                muted
            />
            <video
                ref={remoteVideoRef}
                className="flex-1 rounded-lg border-2 border-white bg-black h-80 sm:h-96"
                autoPlay
            />

        </>
    )
}

export default Videos