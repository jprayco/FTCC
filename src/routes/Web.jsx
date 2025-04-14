import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "../pages/Index";
import Ticket from "../pages/Ticket";

function Web() {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/ticket/:id" element={<Ticket />} />
          </Routes>
        </Router>
      );
}

export default Web
