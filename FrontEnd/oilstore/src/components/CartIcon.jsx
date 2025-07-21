// components/CartIcon.jsx
import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import { Link } from 'react-router-dom';

function CartIcon({ userId }) {
    const [totalItems, setTotalItems] = useState(0);


    useEffect(() => {
        if (!userId) return;

        axios.get(`http://localhost:5000/api/cart/${userId}`)
            .then(res => {
                setTotalItems(res.data.totalItems);

            })
            .catch(err => {
                console.error("Cart fetch error", err);
            });
    }, [userId]);

    return (
        <Link to="/cart" style={{ textDecoration: 'none', color: 'black' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaShoppingCart size={24} />
                <span>{totalItems} items</span>
            </div>
        </Link>
    );
}

export default CartIcon;
