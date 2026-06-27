import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PortfolioPage from "./component/Portfolio";
import Login from "./component/auth/Login";
import Signup from "./component/auth/Signup";
import Dashboard from "./component/Dashboard";
import PortfolioSidebar from "./component/PortfolioSidebar";
import Transactions from "./component/Transactions";
import Analytics from "./component/Analytics";
import Watchlist from "./component/Watchlist";
import MarketOverview from "./component/MarketOverview";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolioSidebar" element={<PortfolioSidebar />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="market-overview" element={<MarketOverview />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
