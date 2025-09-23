
import { Video, Users} from "lucide-react";
const VideocallInterface = () => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-500">Premium Call</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl h-44 flex items-center justify-center">
                    <div className="w-8 h-8 bg-indigo-400 rounded-full"></div>
                </div>

                <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl h-44 flex items-center justify-center">
                    <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                </div>
            </div>

            <div className="flex justify-center gap-4 pt-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Video size={16} className="text-gray-600" />
                </div>
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-4 h-1 bg-white rounded"></div>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users size={16} className="text-gray-600" />
                </div>
            </div>
        </div>
    )
}

export default VideocallInterface