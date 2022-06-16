const mongoose = require('mongoose');


const productSubCategorySchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true , 'Please enter product  sub category name '],
    },
    imgUrl:{
        type:String,
        required:[true , 'Please select product sub category image'],
    },
    productCategoryId: {
        type:String,
        required:[true , 'Please select product category id'],
    }
});

const ProductSubCategory = mongoose.model('ProductSubCategory' , productSubCategorySchema);
module.exports = ProductSubCategory;