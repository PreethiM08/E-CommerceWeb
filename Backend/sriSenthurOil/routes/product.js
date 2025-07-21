const express=require('express');
const router=express.Router();
const {deleteProduct,getAllProducts,addProduct,getProductsByCategory,increaseStock,updateProductStock}=require('../controllers/productController');

router.get('/',getAllProducts);//anyone
router.post('/',addProduct);//admin
router.post('/update-stock', updateProductStock);
router.get('/category/:category', getProductsByCategory);
router.post('/:id/increase-stock', increaseStock);
router.delete('/:id', deleteProduct);
module.exports=router;