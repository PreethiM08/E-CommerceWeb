import React from 'react';
import {useNavigate} from 'react-router-dom';
import CartIcon from '../components/CartIcon';


function Dashboard(){
    const navigate=useNavigate();
    const userId = localStorage.getItem('user_id');
    const handleLogout=()=>{
        localStorage.removeItem('user_id');
        localStorage.removeItem('token');
        navigate('/login');
    };
    return(
        <div style={styles.container}>
            <nav style={styles.nav}>
                <h2 style={styles.title}>Dashboard</h2>
                <CartIcon userId={userId} />
            </nav>
            <h2 style={styles.welcome}>Welcome to the Store</h2>
            <div style={styles.categoryWrapper}>
                <div
                    style={styles.card}
                    onClick={() => navigate('/oil')}
                    className="zoom-card"
                >
                    🛢️ Oil
                </div>
                <div
                    style={styles.card}
                    onClick={() => navigate('/spices')}
                    className="zoom-card"
                >
                    🌶️ Dry Spice Mix
                </div>
            </div>

            <button onClick={handleLogout} style={styles.logoutButton}>
                🚪 Log Out
            </button>
            <style>
                {`
                    .zoom-card {
                        transition: transform 0.3s ease;
                    }
                    .zoom-card:hover {
                        transform: scale(1.05);
                    }
                `}
            </style>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(to right, #fceabb, #f8b500)', // Soft orange/yellow gradient
        padding: '30px',
        position: 'relative',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        color: '#4a1c1c',
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
    },
    welcome: {
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '30px',
    },
    categoryWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        marginTop: '20px',
    },
    card: {
        backgroundColor: '#ffffffdd',
        borderRadius: '16px',
        padding: '40px 60px',
        fontSize: '20px',
        fontWeight: 'bold',
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        cursor: 'pointer',
        textAlign: 'center',
        width: '220px',
        transition: 'all 0.3s ease',
    },
    logoutButton: {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: '#d62828',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease',
    },
};
export default Dashboard;