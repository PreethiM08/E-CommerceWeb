import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CartPage({ userId }) {
    const [cart, setCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isPaying, setIsPaying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:5000/api/cart/${userId}`)
            .then(res => {
                setCart(res.data.items || []);
                setTotalAmount(Number(res.data.totalAmount) || 0);
            })
            .catch(err => console.error(err));
    }, [userId]);

    const updateTotalAmount = (updatedCart) => {
        const newTotal = updatedCart.reduce((sum, item) => sum + Number(item.total_price || 0), 0);
        setTotalAmount(newTotal);
    };

    const handleClearCart = () => {
        axios.delete(`http://localhost:5000/api/cart/${userId}`)
            .then(() => {
                setCart([]);
                setTotalAmount(0);
            })
            .catch(err => console.error(err));
    };

    const handleRemoveItem = async (cartId) => {
        try {
            await axios.delete(`http://localhost:5000/api/cart/item/${cartId}`);
            const updatedCart = cart.filter(item => item.cart_id !== cartId);
            setCart(updatedCart);
            updateTotalAmount(updatedCart);
        } catch (err) {
            console.error('Error removing item:', err);
            alert('Failed to remove item');
        }
    };

    const handlePayment = async () => {
        if (cart.length === 0) return;
        setIsPaying(true);

        try {
            await axios.post('http://localhost:5000/api/order', {
                userId,
                items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price_per_unit: item.price
                })),
                totalAmount,
                paymentMode: 'online',
                isOffline: 0
            });

            await axios.post('http://localhost:5000/api/products/update-stock', {
                items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity
                }))
            });

            await axios.delete(`http://localhost:5000/api/cart/${userId}`);

            navigate('/payment-success');
        } catch (err) {
            console.error('Payment error:', err);
            alert('Payment failed. Please try again.');
            setIsPaying(false);
        }
    };

    return (
        <div style={styles.background}>
            <div style={styles.container}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>← Back</button>
                <h2 style={styles.heading}>🛒 Your Cart</h2>

                {cart.length === 0 ? (
                    <p style={styles.emptyText}>Your cart is empty.</p>
                ) : (
                    <div style={styles.cartList}>
                        {cart.map(item => (
                            <div key={item.cart_id} style={styles.cartItem}>
                                <span style={styles.itemText}>
                                    {item.name} × {item.quantity} = ₹{Number(item.total_price).toFixed(2)}
                                </span>
                                <button
                                    onClick={() => handleRemoveItem(item.cart_id)}
                                    style={styles.removeBtn}
                                    title="Remove item"
                                >
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <h3 style={styles.total}>Total: ₹{Number(totalAmount).toFixed(2)}</h3>

                {cart.length > 0 && (
                    <div style={styles.actions}>
                        <button onClick={handlePayment} disabled={isPaying} style={styles.payBtn}>
                            {isPaying ? 'Processing...' : 'Proceed to Payment'}
                        </button>
                        <button onClick={handleClearCart} style={styles.clearBtn}>Clear Cart</button>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    background: {
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, sans-serif',
    },
    container: {
        background: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        width: '90%',
        maxWidth: '600px',
        position: 'relative',
    },
    heading: {
        textAlign: 'center',
        fontSize: '28px',
        marginBottom: '20px',
        color: '#333',
    },
    backButton: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        fontSize: '18px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#555',
    },
    cartList: {
        marginBottom: '20px',
    },
    cartItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid #eee',
    },
    itemText: {
        fontSize: '16px',
        color: '#444',
    },
    removeBtn: {
        backgroundColor: '#ffdddd',
        border: '1px solid #ff5e5e',
        color: '#d8000c',
        borderRadius: '6px',
        padding: '4px 8px',
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    total: {
        textAlign: 'right',
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#222',
    },
    actions: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    payBtn: {
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background 0.3s',
    },
    clearBtn: {
        backgroundColor: '#f44336',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: '#999',
    },
};

export default CartPage;
