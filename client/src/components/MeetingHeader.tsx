import { Users, Copy, Check, Clock } from "lucide-react";
import { useEffect, useState } from "react";

interface MeetingHeaderProps {
    roomId: string;
    status: string;

}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({ roomId, status }) => {
    const [copied, setCopied] = useState(false);
    const [duration, setDuration] = useState("00:00:00");

    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const hours = Math.floor(elapsed / 1000 / 3600);
            const minutes = Math.floor((elapsed / 1000 % 3600) / 60);
            const seconds = Math.floor((elapsed / 1000) % 60);

            setDuration(
                `${hours.toString().padStart(2, "0")}:` +
                `${minutes.toString().padStart(2, "0")}:` +
                `${seconds.toString().padStart(2, "0")}`
            );
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const copyRoomId = async () => {
        try {
            const meetingUrl = `${window.location.origin}/call/${roomId}`;
            await navigator.clipboard.writeText(meetingUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy :", err)
        }
    };

    return (
        <div className="flex justify-between items-center mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/30">
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                    <Users className="text-white w-5 h-5" />
                    <span className="text-white font-medium">Meeting Room</span>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                        <h1 className="text-xl font-semibold text-white tracking-wide">
                            Room: {roomId}
                        </h1>
                        <span className="text-sm text-white/90">
                            Share this link with participants
                        </span>
                    </div>

                    <button
                        onClick={copyRoomId}
                        className="group flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-3 py-2 transition-all duration-200 border border-white/20 hover:border-white/30"
                        title={copied ? "Copied!" : "Copy meeting link"}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-green-300" />
                                <span className="text-sm text-green-300 font-medium">Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 text-white group-hover:text-white/90" />
                                <span className="text-sm text-white group-hover:text-white/90 font-medium hidden sm:inline cursor-copy">
                                    Copy Link
                                </span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className=" items-center ">
                <div className="flex items-center space-x-2 bg-white/20 rounded-lg px-3 py-2">
                    <Clock className="text-white w-4 h-4" />
                    <span className="text-sm text-white font-mono font-medium">
                        {duration}
                    </span>
                </div>
                <div className="flex items-center justify-center space-x-2 mt-2">
                    <span
                        className={`w-3 h-3 rounded-full ${status === "Connected"
                            ? "bg-green-500"
                            : status === "Connecting..."
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                    ></span>
                    <span className="text-sm text-white">
                        {status}
                    </span>
                </div>

            </div>

        </div>
    );
};

export default MeetingHeader;