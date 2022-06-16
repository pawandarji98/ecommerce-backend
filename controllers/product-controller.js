const Product = require('../data-models/product-model');
const catchError = require('../utils/catch-error');
const Store = require('../data-models/store-model');

exports.createProduct = catchError(async(req , res , next) => {
    const createdProduct = await Product.create({
        name: req.body.name,
        productCategoryId:req.body.productCategoryId,
        productSubCategoryId:req.body.productSubCategoryId,
        companyName:req.body.companyName,
        imgUrl:req.body.imgUrl,
        tabletCapsuleCount:req.body.tabletCapsuleCount,
        gram:req.body.gram,
        ml:req.body.ml,
        description:req.body.description,
        price:req.body.price,
        displayPrice:req.body.displayPrice,
        priceToPayVendors:req.body.priceToPayVendors,
        storeId:req.body.storeId,
        searchCount:0
    })
    return await res.status(201).json({
        status:'success',
        data: createdProduct
    });
})

// exports.getProductsByStoreId = catchError(async(req , res, next) => {
//     console.log("rechaedddddd");
//     const {page,limit,storeId} = await req.query;
//     const products = await Product.find({storeId})
//     .sort('name')
//     const store = await Store.findById(storeId);
//     const StoreDetaildata = await {
//         store:store,
//         products:products
//     }
//     return await res.status(200).json({
//         status: 'Success',
//         StoreDetaildata
//     });
// })

exports.getProductsBySearchKey = catchError(async (req , res , next) => {
    const {page , limit , search=''} = await req.query;
    let products = await Product.find(
        {'name': {'$regex': search,$options:'i'}}
    )
    .limit(limit)
    .skip(limit * page);
    let productDetailData = [];
    for(let pro of await products) {
        let searchCounts;
        let storeId = await pro.storeId;
        const store = await Store.findById(storeId);
        const data = await {
            product:pro,
            store:store
        }
        await productDetailData.push(data);
        if(pro?.searchCount) {
            searchCounts = pro?.searchCount + 1
        } else {
            searchCounts = 1;
        }
        Product.findByIdAndUpdate(
            pro._id,
          { searchCount: searchCounts},
          function (err, docs) {
            if (err) {
              console.log(err);
            } else {
              console.log("Updated User : ", docs);
            }
          }
        );
    }
    return await res.status(200).json({
        status: 'Success',
        productDetailData
    });
})

exports.searchProductsByStore = catchError(async (req , res , next) => {
    const name = await req.params.name;
    const storeId = await req.params.storeId;
    const store = await Store.findById(storeId);
    const products = await Product.find({'name': {'$regex': name,$options:'i'} , storeId})
    let productDetailData = [];
    for(let pro of await products) {
        const data = await {
            product:pro,
            store:store
        }
        await productDetailData.push(data);
    }
    return await res.status(200).json({
        status: 'Success',
        productDetailData
    });
})