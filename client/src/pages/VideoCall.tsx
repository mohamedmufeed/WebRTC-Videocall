import { Mic, Video, Phone, MessageCircle, ScreenShare } from "lucide-react";
import Videos from "../components/Videos";
import { useParams } from "react-router-dom";
import { useState } from "react";

const VideoCall = () => {
    const { roomId } = useParams()
    const [controls, setControls] = useState<{
        toggleMic: (on: boolean) => void;
        toggleVideo: (on: boolean) => void;
        endCall: () => void;
    } | null>(null);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);

    return (
        <div className="min-h-screen bg-[#695ca8] flex flex-col lg:flex-row p-3 sm:p-8">

            {/* Left Section: Videos + Controls */}
            <div className="flex-1 flex flex-col p-6 gap-4">

                {/* Meeting Heading */}
                <div className=" flex justify-between items-center mb-4 rounded-md">
                    <h1 className="text-2xl font-semibold text-white tracking-wide p-4">
                        {`Meeting Room : ${roomId}`}
                    </h1>
                    <span className="text-sm text-gray-200 font-mono">00:25:32</span>
                </div>

                {/* Video Section */}
                <div className="flex flex-col sm:flex-row gap-6 flex-1 justify-center h-full">
                    <Videos roomId={roomId!} setControls={setControls} />
                </div>

                {/* Controls */}
                <div className="mt-4 flex justify-center">
                    <div className="bg-white p-4 rounded-xl flex gap-5 justify-center items-center shadow-lg">
                        <button 
                        onClick={()=>{setMicOn(!micOn) ; controls?.toggleMic(!micOn)}}
                        className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                            <Mic className="text-gray-700" />
                        </button>
                        <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                            <ScreenShare className="text-gray-700" />
                        </button>
                        <button
                        onClick={()=>controls?.endCall()}
                         className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition">
                            <Phone className="text-white" />
                        </button>
                        <button
                          onClick={()=>{setCamOn(!camOn) ; controls?.toggleVideo(!camOn)}}
                         className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                            <Video className="text-gray-700" />
                        </button>
                        <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                            <MessageCircle className="text-gray-700" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Chat Section */}
            <div className="w-full lg:w-1/3 bg-white/50 p-6 flex flex-col border-l rounded-lg shadow-inner">
                {/* Chat Heading */}
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Chat</h2>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 p-2">
                    <div className="bg-gray-100 p-3 rounded-xl w-fit max-w-[80%] shadow-sm">Hello!</div>
                    <div className="bg-blue-200 p-3 rounded-xl w-fit max-w-[80%] self-end shadow-sm">Hi!</div>
                    <div className="bg-gray-100 p-3 rounded-xl w-fit max-w-[80%] shadow-sm">How’s the project going?</div>
                    <div className="bg-blue-200 p-3 rounded-xl w-fit max-w-[80%] self-end shadow-sm">Great! Almost done.</div>
                </div>

                {/* Input */}
                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700 transition"
                    />
                    <button className="bg-white text-black px-5 py-2 rounded-xl hover:bg-gray-200 transition">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;