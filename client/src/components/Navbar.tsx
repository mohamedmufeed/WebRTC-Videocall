import { Video } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="py-6">
            <div className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-center flex justify-center items-center"><Video  size={35}/></span>
                VideoCall
            </div>
        </nav>
    );
};

export default Navbar;
