import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom";
import type { Socket } from "socket.io-client";

interface Props {
    roomId: string
    setControls: (controls: {
        toggleMic: (on: boolean) => void;
        toggleVideo: (on: boolean) => void;
        endCall: () => void;
        startShareScreen: () => void;
        stopShareScreen: () => void;
    }) => void;
    PassConnectionStatus: (connectionStatus: string) => void
    socket: Socket | null
}

const Videos: React.FC<Props> = ({ roomId, setControls, socket, PassConnectionStatus }) => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
    const pcRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const remoteSocketIdRef = useRef<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<string>("Connecting...");
    const navigate = useNavigate()

    useEffect(() => {
        if (!socket) return

        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun.services.mozilla.com' },
                { urls: 'stun:stun.stunprotocol.org:3478' }
            ],
            iceCandidatePoolSize: 10,
        });
        pcRef.current = pc;

        const startLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { min: 640, ideal: 1280, max: 1920 },
                        height: { min: 480, ideal: 720, max: 1080 },
                        frameRate: { min: 15, ideal: 30, max: 60 }
                    },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        sampleRate: 44100
                    }
                });

                localStreamRef.current = stream
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream
                    await localVideoRef.current.play().catch(() => { });
                }

                stream.getTracks().forEach(track => pc.addTrack(track, stream));
            } catch (err) {
                console.error("Error accessing camera/microphone:", err)
            }
        }

        pc.ontrack = (event) => {
            const remoteStream = event.streams[0];
            if (!remoteStream) return;
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = remoteStream;
                remoteAudioRef.current.volume = 1.0;
                remoteAudioRef.current.play().catch(() => { });
            }
            if (remoteVideoRef.current) {
                remoteVideoRef.current.muted = false;
                remoteVideoRef.current.volume = 1.0;
                remoteVideoRef.current.play().catch(() => { });
            }
        }

        pc.onicecandidate = (event) => {
            if (event.candidate && remoteSocketIdRef.current) {
                socket.emit("ice-candidate", { candidate: event.candidate, to: remoteSocketIdRef.current })
            }
        }

        pc.onconnectionstatechange = () => {
            console.log("Peer connection state:", pc.connectionState);
            if (pc.connectionState === "connected") setConnectionStatus("Connected");
            else if (pc.connectionState === "connecting") setConnectionStatus("Connecting...");
            else if (pc.connectionState === "disconnected") setConnectionStatus("Disconnected");
            else if (pc.connectionState === "failed") setConnectionStatus("Connection Failed");
            else if (pc.connectionState === "closed") setConnectionStatus("Call Ended");
        };

        pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === "failed") setConnectionStatus("ICE Failed");
            else if (pc.iceConnectionState === "checking") setConnectionStatus("Checking ICE...");
        };


        startLocalStream();
        socket.emit("join-room", roomId)

        socket.on("user-joined", async (id: string) => {
            remoteSocketIdRef.current = id;
            if (socket.id! < id) setTimeout(() => createOffer(id), 1000);
        })

        socket.on("offer", async ({ offer, from }: any) => {
            remoteSocketIdRef.current = from;
            try {
                if (pc.signalingState !== 'stable' && pc.signalingState === 'have-local-offer' && socket.id! > from) {
                    await pc.setLocalDescription({ type: 'rollback' });
                }
                await pc.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("answer", { answer, to: from });
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        })

        socket.on("answer", async ({ answer }: any) => {
            try {
                if (pc.signalingState === 'have-local-offer') {
                    await pc.setRemoteDescription(new RTCSessionDescription(answer));
                }
            } catch (error) {
                console.error('Error handling answer:', error);
            }
        })

        socket.on("ice-candidate", async ({ candidate }: any) => {
            try {
                if (pc.remoteDescription) {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } else {
                    setTimeout(async () => {
                        if (pc.remoteDescription) await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    }, 1000);
                }
            } catch (error) {
                console.error("Error adding ICE candidate:", error);
            }
        });

        const createOffer = async (id: string) => {
            try {
                const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
                await pc.setLocalDescription(offer);
                socket.emit("offer", { offer, to: id });
            } catch (error) {
                console.error('Error creating offer:', error);
            }
        }

        return () => {
            if (pc.connectionState !== 'closed') pc.close();
            if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop());
            socket.off("user-joined");
            socket.off("offer");
            socket.off("answer");
            socket.off("ice-candidate");
        };

    }, [roomId, socket])

    const toggleMic = (enabled: boolean) => {
        if (!localStreamRef.current) return
        localStreamRef.current.getAudioTracks().forEach(track => track.enabled = enabled)
    }

    const toggleVideo = (enabled: boolean) => {
        if (!localStreamRef.current) return
        localStreamRef.current.getVideoTracks().forEach(track => track.enabled = enabled)
    }

    const endCall = () => {
        if (pcRef.current && pcRef.current.connectionState !== 'closed') pcRef.current.close()
        if (localStreamRef.current) localStreamRef.current.getTracks().forEach(track => track.stop())
        if (localVideoRef.current) localVideoRef.current.srcObject = null
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null
        if (socket) socket.emit("leave-room", roomId)
        navigate("/")
    }

    useEffect(() => {
        setControls({ toggleMic, toggleVideo, endCall, startShareScreen, stopShareScreen });
        PassConnectionStatus(connectionStatus)
    }, [connectionStatus]);

    const startShareScreen = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            const videoTrack = screenStream.getVideoTracks()[0]
            const sender = pcRef.current?.getSenders().find(s => s.track?.kind === "video")
            sender?.replaceTrack(videoTrack)
            if (localVideoRef.current) localVideoRef.current.srcObject = screenStream
            videoTrack.onended = () => stopShareScreen()
        } catch (error) {
            console.error("Screen share error:", error);
        }
    }

    const stopShareScreen = async () => {
        try {

            if (localVideoRef.current?.srcObject instanceof MediaStream) {
                localVideoRef.current.srcObject.getTracks().forEach(t => {
                    if (t.kind === "video" || t.label.includes("Screen")) {
                        t.stop()
                    }
                })
            }
            const localStream = localStreamRef.current
            if (!localStream) return
            const videoTrack = localStream.getVideoTracks()[0]
            const sender = pcRef.current?.getSenders().find((s) => s.track?.kind === "video")
            sender?.replaceTrack(videoTrack);
            if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
        } catch (error) {
            console.error("Stop screen share error:", error);
        }
    }
    return (
        <div className="flex flex-col sm:flex-row gap-6 flex-1 justify-center h-full">
            <audio ref={remoteAudioRef} autoPlay style={{ display: 'none' }} />
            <div className="flex-1 h-96 sm:h-11/12 relative">
                <video
                    ref={localVideoRef}
                    className="w-full h-full rounded-lg bg-black object-cover"
                    autoPlay
                    muted
                    playsInline
                    style={{ transform: "scaleX(-1)" }}
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Local Video
                </div>
            </div>

            <div className="flex-1 h-96 sm:h-11/12 relative">
                <video
                    ref={remoteVideoRef}
                    className="w-full h-full rounded-lg bg-black object-cover"
                    autoPlay
                    playsInline
                    muted={false}
                    controls={false}
                    style={{ transform: "scaleX(-1)" }}
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Remote Video
                </div>
            </div>
        </div>
    )
}

export default Videos
