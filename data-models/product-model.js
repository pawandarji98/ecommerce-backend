const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true , 'name is required']
    },
    productCategoryId: {
        type:String,
        require:[true , 'category is required']
    },
    productSubCategoryId: {
        type:String
    },
    companyName: {
        type:String,
        required:[true , 'Company name is required']
    },
    imgUrl: {
        type:String,
    },
    tabletCapsuleCount: {
        type:Number
    },
    gram: {
        type:Number
    },
    ml: {
        type:Number
    },
    description: {
        type:String
    },
    price: {
        type:Number,
        require:[true , 'price is required']
    },
    displayPrice: {
        type:Number,
    },
    priceToPayVendors: {
        type:Number
    },
    storeId :{
        type:String,
        require:[true , 'Please enter Store Id']
    },
    searchCount: {
        type:Number,
        default:0,
    }
} , 
{
    timestamps:true
});


const Products = mongoose.model('Products' , productSchema);
module.exports = Products;