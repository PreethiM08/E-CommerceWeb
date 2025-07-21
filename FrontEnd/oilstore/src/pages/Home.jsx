import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import storeimg from '../assets/sri.jpg';

const taglines = [
    "Pure. Traditional. Trusted.",
    "From Nature to Bottle",
    "Celebrating Authenticity",
    "Sri Senthur Oil Mill - Since Generations"
];

const Home = () => {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');

    // Typing animation effect
    useEffect(() => {
        const text = taglines[index];
        let i = 0;
        const typing = setInterval(() => {
            setDisplayedText(text.slice(0, i));
            i++;
            if (i > text.length) {
                clearInterval(typing);
                setTimeout(() => {
                    setIndex((index + 1) % taglines.length);
                }, 2000);
            }
        }, 100);

        return () => clearInterval(typing);
    }, [index]);

    return (
        <div className="home-container">
            <img src={storeimg} alt="Oil Mill" className="background-image" />

            <nav className="navbar">
                <h1 className="logo">  </h1>
                <div className="nav-buttons">
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/register')}>Register</button>
                </div>
            </nav>

            <div className="hero-glass">

                <p className="hero-subtitle">{displayedText}</p>
            </div>
        </div>
    );
};

export default Home;
