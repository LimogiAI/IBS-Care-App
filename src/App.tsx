// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Launch from "./Launch";
import Callback from "./Callback";
import Dashboard from "./Dashboard";
import HealthCheck from "./HealthCheck";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/launch" element={<Launch />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/health" element={<HealthCheck />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

