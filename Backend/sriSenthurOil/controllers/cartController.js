const pool = require('../db');

// Add single item to cart
const addToCart = async (req, res) => {
    const { user_id, product_id, quantity, size } = req.body;

    if (!user_id || !product_id || !quantity) {
        return res.status(400).json({ msg: 'Missing required cart fields' });
    }

    try {
        let existing;
        if (size !== undefined) {
            [existing] = await pool.query(
                'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size = ?',
                [user_id, product_id, size]
            );
        } else {
            [existing] = await pool.query(
                'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size IS NULL',
                [user_id, product_id]
            );
        }

        if (existing.length > 0) {
            if (size !== undefined) {
                await pool.query(
                    'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND size = ?',
                    [quantity, user_id, product_id, size]
                );
            } else {
                await pool.query(
                    'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND size IS NULL',
                    [quantity, user_id, product_id]
                );
            }
        } else {
            await pool.query(
                'INSERT INTO cart (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
                [user_id, product_id, quantity, size ?? null]
            );
        }

        const [[{ total, items }]] = await pool.query(
            `SELECT SUM(p.price * c.quantity) AS total, COUNT(*) AS items
             FROM cart c JOIN products p ON c.product_id = p.product_id
             WHERE c.user_id = ?`,
            [user_id]
        );

        res.status(201).json({ msg: 'Item added to cart', total, items });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to add item to cart' });
    }
};

// Add multiple items to cart
const addMultipleToCart = async (req, res) => {
    const { user_id, items } = req.body;

    if (!user_id || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ msg: 'Invalid payload' });
    }

    try {
        const insertPromises = items.map(async ({ product_id, quantity, size }) => {
            const [existing] = await pool.query(
                'SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND size = ?',
                [user_id, product_id, size]
            );

            if (existing.length > 0) {
                return pool.query(
                    'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ? AND size = ?',
                    [quantity, user_id, product_id, size]
                );
            } else {
                return pool.query(
                    'INSERT INTO cart (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)',
                    [user_id, product_id, quantity, size]
                );
            }
        });

        await Promise.all(insertPromises);

        const [[{ total, itemCount }]] = await pool.query(
            `SELECT SUM(p.price * c.quantity) AS total, COUNT(*) AS itemCount
             FROM cart c JOIN products p ON c.product_id = p.product_id
             WHERE c.user_id = ?`,
            [user_id]
        );

        res.status(201).json({ msg: 'Multiple items added to cart', total, itemCount });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to add to cart' });
    }
};

// Get cart for a user
const getCart = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [items] = await pool.query(
            `SELECT c.cart_id, p.name, c.product_id,c.quantity, c.size, p.price,
             (c.quantity * p.price) AS total_price
             FROM cart c
             JOIN products p ON c.product_id = p.product_id
             WHERE c.user_id = ?`,
            [user_id]
        );

        // Log items to verify query success
        console.log(`Cart items for user ${user_id}:`, items);

        // Null-safe addition
        const totalAmount = items.reduce((sum, item) => {
            const price = parseFloat(item.total_price) || 0;
            return sum + price;
        }, 0);

        console.log(`Total amount for user ${user_id}:`, totalAmount);

        res.json({
            items,
            totalAmount,
            totalItems: items.length
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to fetch cart' });
    }
};
const deleteCartItem = async (req, res) => {
    const cartId = req.params.cartId;

    try {
        const [result] = await pool.execute('DELETE FROM cart WHERE cart_id = ?', [cartId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.status(200).json({ message: 'Cart item removed successfully' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Server error while deleting cart item' });
    }
};
// Clear entire cart for a user
const clearCart = async (req, res) => {
    const { user_id } = req.params;

    try {
        await pool.query('DELETE FROM cart WHERE user_id = ?', [user_id]);
        res.json({ msg: 'Cart cleared successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to clear cart' });
    }
};

module.exports = {
    addToCart,
    addMultipleToCart,
    getCart,
    clearCart,
deleteCartItem
};
