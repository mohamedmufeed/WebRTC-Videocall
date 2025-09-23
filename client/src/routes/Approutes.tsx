import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy } from "react"


const Home = lazy(() => import("../pages/Home"))
const VideoCall = lazy(() => import("../pages/VideoCall"))

const Approutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/call/:roomId" element={<VideoCall />} />
            </Routes>
        </Router>
    )
}

export default Approutes