import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

// ✅ AddStock as a proper component
const AddStock = ({ productId, onStockUpdated }) => {
    const [stockToAdd, setStockToAdd] = useState('');
    const token = localStorage.getItem('token');

    const handleAdd = async () => {
        if (!stockToAdd || isNaN(stockToAdd)) return;

        try {
            await axios.post(
                `http://localhost:5000/api/products/${productId}/increase-stock`,
                { quantityToAdd: parseInt(stockToAdd, 10) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStockToAdd('');
            onStockUpdated();
        } catch (err) {
            console.error('Failed to update stock', err);
        }
    };

    return (
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
            <input
                type="number"
                min="1"
                value={stockToAdd}
                onChange={(e) => setStockToAdd(e.target.value)}
                placeholder="+Qty"
                style={{ width: '60px', padding: '4px', fontSize: '14px' }}
            />
            <button onClick={handleAdd} style={styles.addButton}>Add</button>
        </div>
    );
};

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({name: '', quantity: 0, price: 0,
        cost_price: 0, category: '', size: ''});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('http://localhost:5000/api/products', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const mapped = res.data.map(p => ({
                ...p,
                quantity: isNaN(parseInt(p.stock_quantity)) ? 0 : parseInt(p.stock_quantity),
            }));

            const sorted = mapped.sort((a, b) => b.quantity - a.quantity);
            setProducts(sorted);
        } catch (e) {
            console.error(e);
            setError('Failed to load products. Check login or API.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === 'quantity' ? parseInt(value || 0, 10) : value,
        });
    };

    const addProduct = async () => {
        try {
            await axios.post('http://localhost:5000/api/products', form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setForm({
                name: '',
                quantity: 0,
                price: 0,
                cost_price: 0,
                category: '',
                size: ''
            });

            fetchProducts();
        } catch (e) {
            console.error(e);
            setError('Add failed.');
        }
    };

    const deleteProduct = async id => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchProducts();
        } catch (e) {
            console.error(e);
            setError('Delete failed.');
        }
    };

    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);

    const pieData = {
        labels: products.map(p => p.name),
        datasets: [
            {
                label: 'Stock Quantity',
                data: products.map(p => p.quantity),
                backgroundColor: products.map(
                    () => `hsl(${Math.random() * 360}, 70%, 70%)`
                ),
            },
        ],
    };

    return (
        <div style={styles.container}>
            <center><h2>Admin Dashboard</h2></center>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
                ←
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <>
                    <div style={styles.summary}>
                        <h3>Total Stock: {totalStock}</h3>
                    </div>

                    <section style={styles.chart}>
                        <center><h3>Stock Balance Pie Chart</h3></center>
                        <div style={styles.pieContainer}>
                            <Pie data={pieData} />
                        </div>
                    </section>

                    <section style={styles.addFormContainer}>
                        <h3>Add New Product</h3>
                        <div style={styles.addCard}>
                            <input
                                name="name"
                                value={form.name}
                                placeholder="Product Name"
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <input
                                name="quantity"
                                type="number"
                                value={form.quantity}
                                placeholder="Quantity"
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <input
                                name="price"
                                type="number"
                                value={form.price}
                                placeholder="Price"
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <input
                                name="cost_price"
                                type="number"
                                value={form.cost_price}
                                placeholder="Cost Price"
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <input
                                name="category"
                                value={form.category}
                                placeholder="Category"
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <input
                                name="size"
                                value={form.size}
                                placeholder="Size"
                                onChange={handleChange}
                                style={styles.input}
                            />
                            <button onClick={addProduct} style={styles.addButton}>Add Product</button>
                        </div>
                    </section>

                    <section>
                        <h3>Product List</h3>
                        <div style={styles.cardGrid}>
                            {products.map(p => (
                                <div key={p.product_id} style={styles.card}>
                                    <h4>{p.name}</h4>
                                    <p><strong>Stock:</strong> {p.stock_quantity}</p>

                                    {/* ✅ Correct AddStock usage */}
                                    <AddStock
                                        productId={p.product_id}
                                        onStockUpdated={fetchProducts}
                                    />

                                    <button onClick={() => deleteProduct(p.product_id)} style={styles.deleteButton}>
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        position: 'relative',
        backgroundColor: '#FFFFC5',
        minHeight: '100vh',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto', },
    backButton: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'none',
        border: 'none',
        fontSize: '50px',
        cursor: 'pointer',
    },
    chart: { margin: '30px 0' },
    pieContainer: {
        width: '800px',
        height: '800px',
        margin: 'auto',
    },
    addFormContainer: {
        margin: '40px 0 20px',
    },
    addCard: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        padding: '20px',
        maxWidth: '400px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    input: {
        padding: '10px 14px',
        fontSize: '16px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    addButton: {
        backgroundColor: '#4caf50',
        color: '#fff',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '6px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    summary: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '20px',
    },
    card: {
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        transition: 'transform 0.2s',
        textAlign: 'center',
    },
    deleteButton: {
        marginTop: '10px',
        backgroundColor: '#ff4d4f',
        border: 'none',
        color: '#fff',
        padding: '8px 12px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Admin;
