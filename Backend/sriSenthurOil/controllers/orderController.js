const db = require('../db'); // mysql2/promise connection

const placeOrder = async (req, res) => {
    const { userId, items, totalAmount, paymentMode = 'online', isOffline = 0 } = req.body;

    // Validate request payload
    if (
        !userId ||
        !Array.isArray(items) ||
        items.length === 0 ||
        !items.every(item => item.product_id && item.quantity && item.price_per_unit)
    ) {
        return res.status(400).json({ message: 'Invalid order data or one or more items are missing required fields.' });
    }

    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        // Insert into orders table
        const [orderResult] = await conn.query(
            `INSERT INTO orders 
             (user_id, total_amount, payment_status, payment_mode, is_offline) 
             VALUES (?, ?, 'paid', ?, ?)`,
            [userId, totalAmount, paymentMode, isOffline]
        );

        const orderId = orderResult.insertId;

        // Insert each order item
        for (const item of items) {
            const { product_id, quantity, price_per_unit } = item;

            if (!product_id || !quantity || !price_per_unit) {
                throw new Error(`Invalid order item data: ${JSON.stringify(item)}`);
            }

            await conn.query(
                `INSERT INTO order_items 
                 (order_id, product_id, quantity, price_per_unit) 
                 VALUES (?, ?, ?, ?)`,
                [orderId, product_id, quantity, price_per_unit]
            );
        }

        await conn.commit();
        conn.release();

        res.status(201).json({ message: 'Order placed successfully.', orderId });
    } catch (err) {
        await conn.rollback();
        conn.release();
        console.error('Order placement failed:', err);
        res.status(500).json({ message: 'Error placing order.', error: err.message });
    }
};

module.exports={placeOrder}