const ProductCategory  = require('../data-models/product-category-model');
const catchError = require('../utils/catch-error');


exports.createProductCategory = catchError(async(req , res , next) => {
    const createProductCategory = await ProductCategory.create({
        name:req.body.name,
        imgUrl:req.body.imgUrl
    });
    await res.status(201).json({
        status:'Success',
        data:createProductCategory
    });
});

exports.getAllProductCategory = catchError(async(req , res , next) => {
    let categoriesDetailData = [];
    const {page , limit , search=''} = await req.query;
    const productCategories = await ProductCategory.find(
        {'name': {'$regex': search,$options:'i'}}
    )
    .limit(limit)
    .skip(limit * page);

    await res.status(201).json({
        status:'Success',
        data:productCategories
    });

});