import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './pages/Home'
import Login from './components/Login';
import Register from './components/Register';
import OilPage from './components/OilPage';
import SpicesPage from "./components/SpicesPage";
import Dashboard from "./components/Dashboard";
import CartPage from "./components/CartPage";
import PaymentSuccess from './components/PaymentSuccess';
import Admin from './components/Admin';


function App() {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);
    return (
    <Router>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/oil" element={<OilPage/>}/>
            <Route path="/spices" element={<SpicesPage/>}/>
            <Route path="/cart" element={<CartPage userId={userId} />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/admin" element={<Admin/>}/>
        </Routes>
    </Router>
  );
}

export default App;
