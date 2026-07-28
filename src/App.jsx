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
import RequireAuth from "./component/auth/RequireAuth";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/authSlice";

function App() {
  let dispatch = useDispatch();
  let [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsLoading(false);
      return;
    }

    let fetchProfile = async () => {
      try {
        let res = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        dispatch(setUser(res.data));
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Signup />} />
          <Route element={<RequireAuth />}>
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolioSidebar" element={<PortfolioSidebar />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="market-overview" element={<MarketOverview />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
