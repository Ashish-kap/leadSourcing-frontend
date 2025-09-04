import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
// import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
// import { UserSession } from "./UserSession";
import Login from "./pages/login";
import { ProtectedRoute } from "./store/components/ProtectedRoute";
import Extraction from "./pages/Extraction";
import NotFound from "./pages/NotFound";

const RoutesMain = () => (
  <Routes>
    <Route path="/home" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    {/* <Route path="/signup" element={<Signup />} /> */}
    <Route path="*" element={<NotFound />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/extraction" element={<Extraction />} />
    </Route>
  </Routes>
);

export default RoutesMain;
