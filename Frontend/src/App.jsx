import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Roadmap from "./pages/Roadmap";
import RoadmapDetail from "./pages/RoadmapDetail";
import { useAuth } from "./context/AuthContext";
import NotFound from "./pages/notFound";

export default function App() {
  const { token } = useAuth();

  return (
    <div>
      <Routes>
        <Route path="/" element={token ? <Roadmap />:<Login />} />
        <Route path="signup" element={token ? <Roadmap />:<Signup />} />
        <Route path="roadmap" element={token ? <Roadmap /> : <Login />} />
        <Route
          path="roadmap/:id"
          element={token ? <RoadmapDetail /> : <Login />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
