import React from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>✅ Payment Successful</h1>
            <p style={styles.message}>Thank you! Your order has been placed successfully.</p>

            <button style={styles.button} onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    );
}

const styles = {
    container: {
        padding: '50px',
        textAlign: 'center',
    },
    heading: {
        fontSize: '32px',
        marginBottom: '20px',
        color: 'green',
    },
    message: {
        fontSize: '18px',
        marginBottom: '30px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
    },
};

export default PaymentSuccess;
