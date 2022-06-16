const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
// NOTE: validators are not executed at 'undefined' values,
// except 'required' Validator
    email:{
        type:String,
        lowercase:true,
    },
    name:{
        type:String,
        minlenth:3,
        required:[true,'Please enter your first name']
    },
    mobile:{
        type:Number,
        required:[true,'Please enter your mobile no.']
    },
    dob:{
        type:Date,
        required:[true,'Please enter your DOB']
    },
    gender:{
        type:String,
        required:[true,"Please provide your gender "]
    },
    password:{
        type:String,
        required:[true,'Please enter password'],
        minlength:6,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please enter  confirm password'],
        validate:{
            validator:function(el){
                // THis only works on save & create !!
                return el === this.password;
            },
            message:'Confirm paassword is not same'
            
        }
    },
    passwordChangedAt:{type:Date},
    passwordResetToken:String,
    passwordResetExpires:Date,
    role:{
        type:String,
        default:'user',
        enum:['admin','user','distributor']
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    address:{
        type:String,
        required:[true,'Please enter your address']
    },
    pincode:{
        type:Number,
        required:[true , 'please enter pincode']
    }
},{
    timestamps:true
});


userSchema.pre('save', async function(next){
    // we only encrypt the password when it will modify or create
    // otherwise goto the next MW
    if(!this.isModified('password')) return next();
  // encrypt if password will have modified $ created
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});


userSchema.pre(/^find/,function(next){
    // this points to the current query
    this.find({active:{$ne:false}});
    next()
});


userSchema.pre('save',function(next){
    if(!this.isModified('password')||this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})


userSchema.methods.camparePassword = async function(enteredPassword, encryptedPassword){
    // It will firstly encrypted the entered password , compare with
    // encrypted password
    return await bcrypt.compare(enteredPassword,encryptedPassword);
}


userSchema.methods.changePasswordAfter = async function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp<changedTimestamp;
    }
    return false;
}


userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');  //encrypted resetpassword
    this.passwordResetExpires = Date.now()+10*60*1000;
    return resetToken;  // plain resetPassword
}


const User = mongoose.model('User',userSchema);
module.exports = User;