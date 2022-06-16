const express = require('express');
const productSubCategoryController = require('../controllers/product-sub-category-controller');
const router = express.Router();


router.post('/create',productSubCategoryController.createProductSubCategory);
router.get('/get-all', productSubCategoryController.getAllProductSubCategory);
module.exports = router;