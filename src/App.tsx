import "./App.css";
import RoutesMain from "./RoutesMain";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "sonner";
import { Provider } from "react-redux"; 
import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Toaster />
        <RoutesMain />
      </Router>
    </Provider>
  );
}
export default App;
