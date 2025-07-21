const express=require('express');
const router=express.Router();
const{addToCart,getCart,addMultipleToCart,clearCart,deleteCartItem}=require('../controllers/cartController');

router.post('/',addToCart);
router.post('/bulk',addMultipleToCart);
router.get('/:user_id',getCart);
router.delete('/item/:cartId', deleteCartItem);
router.delete('/:user_id',clearCart);

module.exports=router;