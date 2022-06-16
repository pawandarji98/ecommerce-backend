const mongoose = require('mongoose');


const discountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , 'Please enter name']
    },
    type: {
        type: String,
        require:[true , 'Please enter type of']
    },
    percentage:{
        type:Number
    },
    startDate:{
        type:Date,
        require:[true , 'Please enter start date']
    },
    endDate:{
        type:Date,
        require:[true , 'Please enter end date']
    },
    storeId :{
       type:String,
       require:[true , 'Please enter Store Id']
    }
});

const Discount = mongoose.model('Discounts' , discountSchema);
module.exports = Discount;