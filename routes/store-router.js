const express = require('express');
const storeController = require('../controllers/store-controller');


const router = express.Router();

router.post('/create',storeController.createStore);
router.get('/get-stores-location-wise/:address',  storeController.getStoresLocationWise);
router.get('/getStoreById/:id' , storeController.getStoreById);
router.get('/store-detail-data' , storeController.getProductsByStoreId);
router.get('/searchStoreByKey/:name' , storeController.getStoreBySearchKey);
module.exports = router;