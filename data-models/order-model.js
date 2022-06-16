const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    orderNo: {
        type: String,
        required: [true , 'please enter name']
    },
    productIds: [{
        type: String
    }],
    userId: {
        type:String,
        required:[true , 'user id could not be null or empty']
    },
    storeId: {
        type:String,
        required:[true , 'store id could not be  null or empty']
    },
    status: {
        type:String,
        default:'inTransit',
        enum:['inTransit','inDelivery','delivered' , 'cancled' , 'refunded'],
        required:[true , 'status could not be empty']
    },
    paymentMode: {
        type:String,
        default:'online', // this could be removed in future when cash on delivery will be implemented
        enum:['cod' , 'online'],
        required:[true , 'payment mode could not be empty']
    },
    totalAmount: {
        type:Number,
        required:[true , 'amount could not be empty']
    },
    passbookId: {
        type:String,
        required:[true , 'passbook id is required']
    },
    outForDeliveryTime: {
        type:Date
    },
    deliveredTime: {
        type:Date
    }
});

const Orders = mongoose.model('Orders' , orderSchema);
module.exports = Orders;