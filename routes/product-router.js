const express = require('express');
const productController = require('../controllers/product-controller');
const router = express.Router();


router.post('/create',productController.createProduct);
// router.get('/getProdutsByStoreId' , productController.getProductsByStoreId);
router.get('/searchProducts' , productController.getProductsBySearchKey);
router.get('/searchProductByStore/:name/:storeId', productController.searchProductsByStore);
module.exports = router;