import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login/index.jsx'
import 'boxicons'
import AuthLayout from './pages/AuthLayout.jsx'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Home from './pages/Home/index.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthLayout />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="*" element={<AuthLayout />} />
      </Routes>
    </Router>
  </StrictMode>,
)
