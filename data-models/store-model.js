const mongoose = require('mongoose');


const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , 'Please enter name']
    },
    ownername: {
        type: String,
        required: [true , 'Please enter owner name']
    },
    contactnumber: {
        type:Number,
        required: [true , 'Please enter contact number']
    },
    email : {
        type: String,
        required: [true , 'Please enter register email']
    },
    address : {
        type: String,
        required : [true , 'please enter address']
    },
    address_street : {
        type:String,
    },
    city : {
        type:String
    },
    state: {
        type:String,
    },
    country: {
        type:String
    },
    pincode: {
        type:Number
    },
    logo : {
        type : String,
        required : [true , 'please select logo']
    },
    searchCount: {
        type:Number,
    },
},{
    timestamps:true
}
);

const Store = mongoose.model('Store' , storeSchema);
module.exports = Store;