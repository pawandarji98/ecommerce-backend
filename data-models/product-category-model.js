const mongoose = require('mongoose');


const productCategorySchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true , 'Please enter product category name '],
    },
    imgUrl:{
        type:String,
        required:[true , 'Please select product category image']
    }
});

const ProductCategory = mongoose.model('ProductCategory' , productCategorySchema);
module.exports = ProductCategory;