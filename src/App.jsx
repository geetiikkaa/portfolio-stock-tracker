import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PortfolioPage from './component/Portfolio'
import Login from './component/auth/Login'
import Signup from './component/auth/Signup'
import Dashboard from './component/Dashboard'
import PortfolioSidebar from './component/PortfolioSidebar'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolioSidebar" element={<PortfolioSidebar />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
