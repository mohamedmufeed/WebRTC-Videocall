import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Users, Shield } from "lucide-react";
import VideocallInterface from "../components/VideocallInterface";
import { generateRoomId } from "../utils/genrateRoomid";
import Navbar from "../components/Navbar";

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState("")

    const handleCreateMeeting = () => {
        const newRoomId = generateRoomId();
        navigate(`/call/${newRoomId}`);
    };

    const handleJoinMeeting = () => {
        if (roomId.trim() === "") return setError("Enter a Room ID");
        navigate(`/call/${roomId}`);
    };

    return (
        <div className="min-h-screen bg-[#695ca8]">
            <div className="absolute inset-0 bg-gradient-to-l from-white/30 via-white/20 to-white/0 pointer-events-none"></div>


            <div className="px-4 sm:px-6 lg:px-20">
                {/* Replace with your actual Navbar component */}
              <Navbar/>

                <div className="flex flex-col lg:flex-row justify-between items-center mt-16 gap-12">
                    {/* Left Content */}
                    <div className="flex-1 max-w-2xl space-y-8">
                        <div className="space-y-6">


                            <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight py-10">
                                Premium video meetings.{" "}
                                Now for everyone.
                            </h1>

                            <p className="text-base text-white leading-relaxed">
                                Start a new meeting instantly or enter a code to join.
                                Crystal clear video, secure connections, no downloads required.
                            </p>
                        </div>


                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-gray-400">
                                <div className="flex-1 h-px bg-gray-200"></div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={handleCreateMeeting}
                                        className="group bg-gradient-to-r bg-white text-black px-6 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Video size={20} />
                                        New Meeting
                                    </button>

                                </div>
                                <div className="flex-1 w-full relative">
                                    <input
                                        type="text"
                                        placeholder="Enter Meeting Code"
                                        value={roomId}
                                        onChange={(e) => setRoomId(e.target.value)}
                                        className={`w-full border-2 text-white placeholder-white px-6 py-3 rounded-xl text-lg focus:outline-none transition-colors duration-200 ${error ? "border-red-300" : "border-white"
                                            }`}
                                    />
        
                                    {error && <p className="absolute -bottom-6 left-5 text-sm text-red-300">{error}</p>}
                                </div>

                                <button
                                    onClick={handleJoinMeeting}
                                    className={` border-2 ${roomId ? "text-black border-gray-500 bg-gray-100 " : "text-gray-700 border-gray-200 bg-white "}  px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 `}
                                >
                                    <Users size={20} />
                                    Join
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-white">
                            <Shield size={16} />
                            <p className="text-sm">No account required • End-to-end encrypted • Free to use</p>
                        </div>
                    </div>


                    <div className="flex-1 max-w-lg lg:max-w-xl">
                        <div className="relative">

                            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-3xl blur-2xl opacity-30"></div>

                            <div className="relative bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
                                <VideocallInterface />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;