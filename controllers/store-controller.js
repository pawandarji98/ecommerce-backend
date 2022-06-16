const Store = require('../data-models/store-model');
const Product = require('../data-models/product-model');
const catchError = require('../utils/catch-error');

exports.createStore = catchError(async(req , res , next) => {
    const createdStore = await Store.create({
        name: req.body.name,
        ownername: req.body.ownername,
        contactnumber: req.body.contactnumber,
        email: req.body.email,
        address: req.body.address,
        address_street:req.body.address_street,
        city:req.body.city,
        state:req.body.state,
        country:req.body.country,
        pincode:req.body.pincode,
        logo: req.body.logo,
        searchCount:0
    })
    res.status(201).json({
        status:'success',
        data: createdStore
    });
})

exports.getStoresLocationWise = catchError(async(req , res,  next) => {
    let stores = await Store.find().sort({searchCount: -1});
    const address = await req.params.address;
    let data = [];
    //console.log("Stores" , stores);
    // for(let data of stores) {

    // }
    res.status(201).json({
        status:'success',
        data:stores
    });
})

exports.getStoreById = catchError(async (req , res , next) => {
    const id = req.params.id;
    const store = await Store.findById(id);
    res.status(201).json({
        status:'success',
        data:store
    });
});

exports.getStoreBySearchKey = catchError(async (req , res , next) => {
    const name = await req.params.name
    const stores = await Store.find({'name': {'$regex': name,$options:'i'}});
    return await res.status(200).json({
        status: 'Success',
        stores
    });
});

exports.getProductsByStoreId = catchError(async(req , res, next) => {
    const {storeId , productSubCategoryId} = await req.query;
    let products;
    console.log(productSubCategoryId , 'iddddddd');
    if(productSubCategoryId !== '') {
        products = await Product.find({
            storeId:storeId,
            productCategoryId:'6248431a7e28def33a02fd3c',
            productSubCategoryId
        })
        .sort('name');
    } else {
        products = await Product.find({
            storeId:storeId,
            productCategoryId:'6248431a7e28def33a02fd3c',
        })
        .sort('name');
    }
    const store = await Store.findById(storeId);
    const StoreDetaildata = await {
        store:store,
        products:products
    }
    return await res.status(200).json({
        status: 'Success',
        StoreDetaildata
    });
});