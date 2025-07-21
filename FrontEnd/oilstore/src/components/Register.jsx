import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
    const [form, setForm] = useState({
        name: '',
        phone: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', form);
            alert(res.data.msg || 'Registered successfully');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.msg || 'Registration Failed');
        }
    };

    return (
        <div className="register-page">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    value={form.name}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    value={form.phone}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                    value={form.email}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Create Password"
                    onChange={handleChange}
                    value={form.password}
                    required
                />
                <button type="submit">Register</button>
            </form>
        </div>

    );
}

export default Register;
