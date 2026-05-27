import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { primeFingerprint } from "./service/fingerprint";

primeFingerprint();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
