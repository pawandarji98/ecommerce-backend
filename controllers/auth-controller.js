const {promisify} =require('util');
const User = require('../data-models/user-model');
const catchError = require('../utils/catch-error');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/app-error');
const crypto = require('crypto');

//GENERATING JWT
const signToken = id =>{
    return  jwt.sign({id}, "gireghh4554uujggoi34uttygf3jj5yuid24ifj3",{expiresIn:"51d"});
}

// CREATING AND SENDING TOKEN
const createSendToken = async(user,statusCode,res)=>{
    const token = await signToken(user._id);
    res.status(statusCode).json({
        status:'success',
        token:token,
        user:user
    });
}


// SIGN UP PROCEEDURE
exports.signUp = catchError(async(req, res,next)=>{
    console.log("reached");
    const mobile = await req.body.mobile;
    //let email = '';
    const foundUser = await User.findOne({mobile});
    // if(req.body.email === '') {
    //     email = null;
    // } else {
    //     email = req.body.email
    // }
    if(foundUser) {
        res.status(200).json({
            status:'failed',
            message:"Account with same mobile already exists"
        });
    } else {
        const userCreated = await User.create({
        name:req.body.name,
        email:req.body.email || null,
        mobile:req.body.mobile,
        password:req.body.password,
        address:req.body.address,
        passwordConfirm:req.body.passwordConfirm,
        dob:req.body.dob,
        gender:req.body.gender,
        pincode:req.body.pincode,
        // panCard:url+'/panCard/'+req.files.panCard[0].panCard,
        // adhaar:url+'/adhaar/'+req.files.adhaar[0].adhaar,
        });
        createSendToken(userCreated,201,res);
    }
});


// LOGIN PROCEEDURE
exports.login = catchError(async(req,res,next)=>{
    console.log("body" , req.body);
    const {mobile,password} = req.body;
    console.log("mobile" , mobile);
    if(!mobile || !password){
        return next(new AppError('Please enter mobile and password',400));
    }

    const user = await User.findOne({mobile}).select('+password');
    if(!user || !(await user.camparePassword(password, user.password))){
        return next(new AppError('Invalid mobile and password',404));
    }
    createSendToken(user,200,res);
});


// PROTECTED ROUTES
 exports.protect = catchError(async(req, res,next)=>{
 let token;
    
 // 1) getting toek and checking if it is valid or not
 if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1];
 }
 if(!token){
     return next(new AppError('Yor are not logged in. Please login first!',401))
 }

  //2)verifying token
  const decoded = await promisify(jwt.verify)(token,"gireghh4554uujggoi34uttygf3jj5yuid24ifj3");
  
  //3) checki if user still exists or not
  const currentUser = await User.findById(decoded.id);

  //returnig if user does not exists
  if(!currentUser){
      return next(new AppError('The user belonging to this token is no longer exist',401));
  }

   //4)Check if user changed password after the token was issued
   await currentUser.changePasswordAfter(decoded.iat).then(isPassChanged =>{
    if(isPassChanged){
        return next(new AppError('User has changed their password recenly',401))
    }
   });

 // grant access protected route
 req.user = currentUser;
    next();
 });



 // AUTHORIZATION
  exports.restrictTo = (...roles) => {
      return (req,res,next)=>{
         if(!roles.values(req.user.role)){
             next(new AppError('You do not have a permission to perform this action!',403))
         } 
    }
  }


  // FORGOT PASSWORD
  exports.forgotPasswrod = catchError(async(req,res,next)=>{
      //1) checking if user with mail exists or not
      const user = await User.findOne({email:req.body.email});
      if(!user){
        return next(new AppError('there is no user with this email addr', 404));
        }
      //2) generating reset token
       const resetToken = user.createPasswordResetToken();
       await user.save({validateBeforeSave:false});

       //3) sending mail to user
      try{
        //  await sendEmail({
        //  email:user.email,
        //  token:resetToken
        //  });
         res.status(200).json({
         status:'success',
         message:'Token sent to email!'
         });
        }
   catch(err){
       console.log(err);
       user.passwordResetToken = undefined;
       user.passwordResetExpires = undefined;
       await user.save({validateBeforeSave:false});
       return next(new AppError('there was an error sending the email. Try again later',500));
   }
  });


  //RESET PASSWORD PROCEDURE
  exports.resetPassword = catchError(async(req, res , next)=>{
    //1) get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken:hashedToken,passwordResetExpires:{$gt: Date.now()}});
    
    if(!user){
        return next(new AppError('Token is invalid or has expired',400));
    }
    //2) if token has not expired , and there is user, set the new password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save();
    createSendToken(user,200,res);
    });

    //UPDATE PASSWORD
    exports.updatePassword = catchError(async(req, res,next)=>{
        //1) get user from collection
        const user = await User.findById(req.user.id).select('+password');
        //2) check if posted current password is correct
        if(!(await user.camparePassword(req.body.passwordCurrent, user.password))){
            return next(new AppError('Your current password is wrong ',401));
        }
        //3) if so ,update password
         user.password= req.body.password;
         user.passwordConfirm = req.body.passwordConfirm;
         await user.save();
         // user.findByIdAndUpdate will NOT work as intended(or do'nt use it in password related  field otherwise some validation or pre() MW not work)
         createSendToken(user,200,res);
    });