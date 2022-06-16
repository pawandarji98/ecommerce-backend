const mongoose = require('mongoose');


const passbookSchema = new mongoose.Schema({
    storeId:{
        type:String,
        required:[true , 'store id could not be empty']
    },
    user_id:{
        type:String,
        required:[true , 'urser id could not be empty']
    },
    payment_id:{
        type:String,
        required:[true , 'payment id could not be empty']
    },
    amount:{
        type:Number,
        required:[true , 'amount could not be empty']
    },
    productIds: [{
        type: String
    }]
} , {
    timestamps:true
});


const Passbook = mongoose.model('Passbook',passbookSchema);
module.exports = Passbook;