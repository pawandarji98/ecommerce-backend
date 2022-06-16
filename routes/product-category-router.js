const express = require('express');
const productCategoryController = require('../controllers/product-category-controller');
const router = express.Router();


router.post('/create',productCategoryController.createProductCategory);
router.get('/get-all', productCategoryController.getAllProductCategory);
module.exports = router;