import React, {useEffect,useState} from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function OilPage(){
    const [products,setProducts]=useState([]);

    useEffect(()=>{
        axios.get('http://localhost:5000/api/products/category/Oil')
            .then(res=>setProducts(res.data))
            .catch(err=>console.error('Error fetching oil products',err));
    },[]);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🛢️ Oil Products</h2>

            <div style={styles.grid}>
                {products.map((product) => (
                    <div key={product.product_id} className="card-animate">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <style>
                {`
                    .card-animate {
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }
                    .card-animate:hover {
                        transform: scale(1.03);
                        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
                    }
                `}
            </style>
        </div>
    );
}
const styles = {
    container: {
        minHeight: '100vh',
        padding: '40px 30px',
        background: 'linear-gradient(to right, #fff1b8, #ffe57f)',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    },
    title: {
        textAlign: 'center',
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#6a040f',
        marginBottom: '40px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '30px',
        justifyContent: 'center',
    },
};

export default OilPage;