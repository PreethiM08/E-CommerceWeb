import React, { useState } from 'react';
import axios from 'axios';

function ProductCard({ product }) {
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState('');

    const handleAddToCart = async () => {
        const userIdString = localStorage.getItem('user_id');
        console.log("🔍 Checking user_id from localStorage:", userIdString);

        const userId = parseInt(userIdString);

        if (!userIdString || isNaN(userId)) {
            alert("Please login first");
            return;
        }

        if (product.availableSizes?.length > 0 && !size) {
            alert("Please select a size");
            return;
        }

        if (quantity < 1) {
            alert("Please enter a valid quantity");
            return;
        }

        const cartItem = {
            user_id: userId,
            product_id: product.product_id,
            quantity,
            size: product.availableSizes?.length > 0 ? size : null
        };

        console.log("📦 Final Payload to API:", cartItem);

        try {
            await axios.post('http://localhost:5000/api/cart', cartItem);
            alert('Product added to cart!');
        } catch (err) {
            console.error('❌ Error:', err.response?.data || err.message);
            alert(err.response?.data?.msg || 'Error adding product to cart');
        }
    };

    return (
        <div style={styles.card} className="product-card">
            <h4 style={styles.name}>{product.name}</h4>
            <p style={styles.detail}>Price: ₹{product.price ?? 'N/A'}</p>

            {product.availableSizes && product.availableSizes.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                    <label htmlFor={`size-select-${product.product_id}`}
                    style={styles.label}>Select Size:</label>
                    <select
                        id={`size-select-${product.product_id}`}
                        value={size}
                        onChange={e => setSize(e.target.value)}
                    style={styles.select}>
                        <option value="">-- Select --</option>
                        {product.availableSizes.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
            )}

            <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                min="1"
                style={styles.input}
            />
            <button onClick={handleAddToCart} style={styles.button}>
                Add to Cart
            </button>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: '#fff9db',
        border: '1px solid #facc15',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease',
        textAlign: 'center',
        color: '#6a040f',
    },
    name: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    detail: {
        fontSize: '16px',
        margin: '6px 0',
    },
    button: {
        marginTop: '10px',
        background: 'linear-gradient(to right, #facc15, #f59e0b)',
        color: '#fff',
        padding: '10px 18px',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '16px',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s ease',
    },
    input: {
        padding: '8px 12px',
        width:'100px',
        border: 'bold',
        borderBottom: '2px solid #7f1d1d',
        backgroundColor: 'transparent',
        marginBottom: '10px',
        fontSize: '16px',
        color: '#000',

    },
    select: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '15px',
        outline: 'none',
    },
    label: {
        marginRight: '6px',
        fontWeight: '500',
    },
};

export default ProductCard;
