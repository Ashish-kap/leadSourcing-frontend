import { Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/LandingPage";
// import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
// import { UserSession } from "./UserSession";
import Login from "./pages/login";
import { ProtectedRoute } from "./store/components/ProtectedRoute";
import Extraction from "./pages/Extraction";
import NotFound from "./pages/NotFound";
import Subscription from "./pages/subscription";
import Account from "./pages/Account";
// import Privacy from "./pages/privacy";
// import TermsOfService from "./pages/TermsOfService";



const RoutesMain = () => (
  <Routes>
    {/* Privacy and terms are handled by Vercel redirects in vercel.json */}
    <Route path="/login" element={<Login />} />
    {/* <Route path="/signup" element={<Signup />} /> */}
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/extraction" element={<Extraction />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/account" element={<Account />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default RoutesMain;
