import { Mic, Video, Phone, MessageCircle, ScreenShare, MicOff, VideoOff, ScreenShareOff } from "lucide-react";
import Videos from "../components/Videos";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Chat from "../components/Chat";
import { useSocket } from "../hooks/useSocket";
import MeetingHeader from "../components/MeetingHeader";

const VideoCall = () => {
    const { roomId } = useParams()
    const [controls, setControls] = useState<{
        toggleMic: (on: boolean) => void;
        toggleVideo: (on: boolean) => void;
        endCall: () => void;
        startShareScreen:()=>void;
        stopShareScreen:()=>void
    } | null>(null);
    const [status, setStatus] = useState("")
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const socket = useSocket("http://localhost:5001");
    const userId = "user-" + Math.floor(Math.random() * 1000);
    const [showChat, setShowChat] = useState(true)
    const [startSharing, setStartSharing] = useState(false)

    return (
        <div className="min-h-screen bg-[#695ca8] flex flex-col lg:flex-row p-3 sm:p-8">

            {/* Left Section: Videos + Controls */}
            <div className="flex-1 flex flex-col p-6 gap-4">

                {/* Meeting Heading */}
                <MeetingHeader roomId={roomId!} status={status} />

                {/* Video Section */}
                <div className="flex flex-col sm:flex-row gap-6 flex-1 justify-center h-full">
                    <Videos roomId={roomId!} setControls={setControls} PassConnectionStatus={setStatus} socket={socket} />
                </div>

                {/* Controls */}
                <div className="mt-4 flex justify-center">
                    <div className="bg-white p-4 rounded-xl flex gap-5 justify-center items-center shadow-lg">
                        <button
                            onClick={() => { setMicOn(!micOn); controls?.toggleMic(!micOn) }}
                            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                            {micOn ? <Mic className="text-gray-700" /> : <MicOff className="text-gray-700" />}
                        </button>

                        {startSharing ? 
                        <button
                        onClick={()=>{setStartSharing(false) ; controls?.stopShareScreen()}}
                         className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                            <ScreenShareOff className="text-gray-700" />
                        </button> :
                         <button 
                           onClick={()=>{setStartSharing(true) ; controls?.startShareScreen()}}
                         className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                            <ScreenShare className="text-gray-700" />
                        </button>}

                        <button
                            onClick={() => controls?.endCall()}
                            className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                            <Phone className="text-white" />
                        </button>
                        <button
                            onClick={() => { setCamOn(!camOn); controls?.toggleVideo(!camOn) }}
                            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                            {camOn ? <Video className="text-gray-700" /> : <VideoOff className="text-gray-700" />}
                        </button>
                        <button
                            onClick={() => setShowChat(!showChat)}
                            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                            <MessageCircle className="text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>

            {showChat && <Chat roomId={roomId!} userId={userId} socket={socket} />}

        </div>
    );
};

export default VideoCall;