import { Routes, Route } from "react-router-dom";
// import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/login";
import { withProfileModalOnHome } from "./components/profile/withProfileModalOnHome";
// import { UserSession } from "./UserSession";

const DashboardWithProfileModal = withProfileModalOnHome(Dashboard);
import { ProtectedRoute } from "./store/components/ProtectedRoute";
import Extraction from "./pages/Extraction";
import FindLeads from "./pages/FindLeads";
import Leads from "./pages/Leads";
import NotFound from "./pages/NotFound";
import ShareView from "./pages/ShareView";
import Subscription from "./pages/subscription";
import Account from "./pages/Account";
import Affiliate from "./pages/Affiliate";
// import Privacy from "./pages/privacy";
// import TermsOfService from "./pages/TermsOfService";



const RoutesMain = () => (
  <Routes>
    {/* Privacy and terms are handled by Vercel redirects in vercel.json */}
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/verify-email" element={<VerifyEmail />} />
    {/* Public lead-magnet page — must stay outside ProtectedRoute. */}
    <Route path="/share/:shareId" element={<ShareView />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<DashboardWithProfileModal />} />
      <Route path="/extraction" element={<Extraction />} />
      <Route path="/find-leads" element={<FindLeads />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/subscription" element={<Subscription />} />
      <Route path="/affiliate" element={<Affiliate />} />
      <Route path="/account" element={<Account />} />
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default RoutesMain;
