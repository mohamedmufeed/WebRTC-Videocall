import { Mic, Video, Phone, MessageCircle, ScreenShare } from "lucide-react";
import Videos from "../components/Videos";
import { useParams } from "react-router-dom";

const VideoCall = () => {
    const {roomId}=useParams()
    const meetingTitle = "Meeting Room - ABC123";

    return (
        <div className="min-h-screen bg-[#695ca8] flex flex-col lg:flex-row">

            {/* Left (Videos + Controls) */}
            <div className="flex-1 flex flex-col p-6 gap-4">

                {/* Heading */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-white">
                        {meetingTitle}
                    </h1>
                    <span className="text-sm text-gray-200">00:25:32</span>
                    {/* You can replace this with a live meeting timer */}
                </div>

                {/* Videos */}
               <div className="flex flex-col sm:flex-row gap-6 flex-1 justify-center h-full">
                    <Videos roomId={roomId!}/>
                </div>

                {/* Controls */}
                <div className="bg-white p-4 rounded-lg flex gap-6 justify-center items-center shadow-md">
                    <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                        <Mic className="text-gray-700" />
                    </button>
                    <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                        <ScreenShare className="text-gray-700" />
                    </button>

                    <button className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600">
                        <Phone className="text-white" />
                    </button>

                    <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                        <Video className="text-gray-700" />
                    </button>

                    <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                        <MessageCircle className="text-gray-700" />
                    </button>
                </div>
            </div>

            {/* Right Chat Section */}
            <div className="w-full lg:w-1/3 bg-white p-6 flex flex-col border-l">
                <h2 className="text-xl font-semibold mb-4">Chat</h2>
                <div className="flex-1 overflow-y-auto space-y-2">
                    <div className="bg-gray-200 p-2 rounded-md w-fit">Hello!</div>
                    <div className="bg-blue-200 p-2 rounded-md self-end w-fit">Hi!</div>
                </div>

                {/* Input */}
                <div className="mt-4 flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
