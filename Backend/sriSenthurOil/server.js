const express=require('express');
const cors=require('cors');
const authRoutes=require('./routes/authRoutes');
const productRoutes=require('./routes/product');
const cartRoutes=require('./routes/cart');
const orderRoutes = require('./routes/order');

const app=express();
const PORT= 5000;

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/order', orderRoutes);

//Default route
app.get('/',(req,res)=>{
    res.send('Oil Store API is running..');
});

//start server
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})