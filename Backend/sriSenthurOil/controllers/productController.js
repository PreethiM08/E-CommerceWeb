const pool=require('../db');

//get all products
const getAllProducts=async (req,res)=>{
    try{
        const[products]=await pool.query('SELECT * FROM products');
        res.json(products);
    } catch(err){
        console.error(err);
        res.status(500).json({msg:'Failed to fetch products'});
    }
};

const getProductsByCategory= async (req,res)=>{
    const {category}=req.params;

    try{
        const[products]=await pool.query(
            'SELECT * FROM products WHERE category =?',[category]
        );
        res.json(products);
    }catch(err){
        console.error(err);
        res.status(500).json({msg:'Failed to fetch category products'});
    }
};

//add product by admin

const addProduct=async(req,res)=>{
    const{name,price,cost_price,stock_quantity,category,size}=req.body;

    try{
        await pool.query('INSERT INTO products (name,price,cost_price,stock_quantity,category,size) VALUES(?,?,?,?,?,?)',
            [name,price,cost_price,stock_quantity,category,size]);
        res.status(201).json({msg:'Product added'});
    }catch(err){
        console.error(err);
        res.status(500).json({msg:'Failed to add product'});
    }
};
const db = require('../db'); // Adjust path if needed

const updateProductStock = async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid items array.' });
    }

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        for (const item of items) {
            const [result] = await conn.query(
                `UPDATE products 
                 SET stock_quantity = stock_quantity - ? 
                 WHERE product_id = ? AND stock_quantity >= ?`,
                [item.quantity, item.product_id, item.quantity]
            );

            if (result.affectedRows === 0) {
                throw new Error(`Insufficient stock for product_id: ${item.product_id}`);
            }
        }

        await conn.commit();
        conn.release();

        res.status(200).json({ message: 'Stock updated successfully.' });
    } catch (err) {
        await conn.rollback();
        conn.release();
        console.error('Stock update failed:', err);
        res.status(500).json({ message: 'Error updating stock.', error: err.message });
    }
};

const increaseStock = async (req, res) => {
    const productId = req.params.id;
    const { quantityToAdd } = req.body;

    if (!quantityToAdd || isNaN(quantityToAdd) || quantityToAdd <= 0) {
        return res.status(400).json({ error: 'Invalid quantity to add' });
    }

    try {
        const [rows] = await db.query('SELECT stock_quantity FROM products WHERE product_id = ?', [productId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const newQuantity = rows[0].stock_quantity + parseInt(quantityToAdd);

        await db.query('UPDATE products SET stock_quantity = ? WHERE product_id = ?', [newQuantity, productId]);

        res.json({ success: true, newQuantity });
    } catch (err) {
        console.error('Error increasing stock:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const deleteProduct = async (req, res) => {
    const productId = req.params.id;

    try {
        const [result] = await pool.query('DELETE FROM products WHERE product_id = ?', [productId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports={deleteProduct,getAllProducts,addProduct,getProductsByCategory,updateProductStock,increaseStock}