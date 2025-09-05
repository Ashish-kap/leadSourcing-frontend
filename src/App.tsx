import "./App.css";
import RoutesMain from "./RoutesMain";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import {
  initAnalytics,
  trackPageView,
  // setUserId,
  // setUserProps,
} from "@/service/analytics";

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

const GAListener = () => {
  const location = useLocation();

  useEffect(() => {
    initAnalytics(GA_ID);
  }, []);

  useEffect(() => {
    trackPageView(GA_ID, location.pathname + location.search);
  }, [location]);

  // If you have user info globally, you can set it here.
  // Example wiring (left inert by default):
  // useEffect(() => {
  //   setUserId(GA_ID, user?.id);
  //   setUserProps({ plan: user?.plan || "free", role: user?.role || "user" });
  // }, [user]);

  return null;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <GAListener />
        <Toaster />
        <RoutesMain />
      </Router>
    </Provider>
  );
}
export default App;
