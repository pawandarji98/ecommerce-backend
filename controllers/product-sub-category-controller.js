const ProductSubCategory = require('../data-models/product-sub-category-model');
const catchError = require('../utils/catch-error');


exports.createProductSubCategory = catchError(async(req , res , next) => {
    const createProductSubCategory = await ProductSubCategory.create({
        name:req.body.name,
        imgUrl:req.body.imgUrl,
        productCategoryId:req.body.productCategoryId
    });

    await res.send(201).json({
        status:'Success',
        data:createProductSubCategory
    });
})

exports.getAllProductSubCategory = catchError(async(req , res , next) => {
    const categoryId = await '6248431a7e28def33a02fd3c';
    const productSubCategories = await ProductSubCategory.find({productCategoryId:categoryId});
    await res.status(201).json({
        status:'Success',
        data:productSubCategories
    });

});