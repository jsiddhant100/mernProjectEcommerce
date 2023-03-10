const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors=require("../middleware/catchAsyncError");
const User=require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail= require("../utils/sendEmail");
const cloudinary= require("cloudinary")
const crypto= require("crypto");
//Register a user 
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
let user;
if(req.body.avatar===""){
    const {name, email, password,}=req.body 
     user= await User.create({
        name,email,password,
        avatar:{
            public_id:"Sample Image",
            url: "/Profile.png",
        }
    }); 
}else{
    const myCloud= await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width:150,
        crop:"scale"
    })
   
    const {name, email, password,}=req.body 
     user= await User.create({
        name,email,password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    }); 
    
}





    // const myCloud= await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     folder: "avatars",
    //     width:150,
    //     crop:"scale"
    // })
   
    // const {name, email, password,}=req.body 
    // const user= await User.create({
    //     name,email,password,
    //     avatar:{
    //         public_id: myCloud.public_id || "Sample Image",
    //         url: myCloud.secure_url || "/Profile.png",
    //     }
    // }); 






    // const token=user.getJWTToken();
    // res.status(201).json({
    //     success:true,
    //     token,
    // })
    sendToken(user, 201, res);
})

//Login User
exports.loginUser=catchAsyncErrors(async(req, res, next)=>{
    const {email, password}= req.body
    //checking if user has given password and email both
    if(!email||!password){
        return next(new ErrorHander("Please Enter Email and Password", 400))
    }
    const user= await User.findOne({email}).select("+password")
  // console.log(user);
    if(!user){
        return next(new ErrorHander("Invalid email or password",401))
    }
    const isPasswordMatched= await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid email or password",401))
    }
    // const token=user.getJWTToken();
    // res.status(200).json({
    //     success:true,
    //     token,
    // })

    sendToken(user, 200, res);
})

//logout user
exports.logout=catchAsyncErrors(async(req,res,next)=>{
//  res.cookie("token", null,{
//     expiers:new Date(Date.now()),
//     httpOnly:true,
// }); 
res.clearCookie("token");

    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
})

//Forgot Password
exports.forgotPassword=catchAsyncErrors(async(req,res,next)=>{
    const user= await User.findOne({email:req.body.email});
    if(!user){
        return next(new ErrorHander("User not found", 404));
    }
    //get reset password token
    const resetToken= user.getResetPasswordToken()
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;    //`http://localhost/api/vi/password/reset/${resetToken}`
    // const resetPasswordUrl=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message=`Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject:`Ecommerce Password recovery`,
            message,
        });
    res.status(200).json({
        success:true,
        message:`Email send to ${user.email} successfully`
    })

    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpier=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHander(error.message, 500));
    }
})

//reset password
exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{
//creating token hash
const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");
//console.log(resetPasswordToken);
const user =await User.findOne({
    resetPasswordToken,
    resetPasswordExpier:{$gt: Date.now()},
});
if(!user){
    return next(new ErrorHander("Reset Password Token is invalid or has been expired", 400));
}
if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHander("password does not match", 400));
}
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpier=undefined;
    await user.save();
    sendToken(user,200,res );
});

//Get User details
exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user= await User.findById(req.user.id);


    res.status(200).json({
        success:true,
        user
    });
});

//Update User Password
exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{
    const user= await User.findById(req.user.id).select("+password");
    const isPasswordMatched= await user.comparePassword(req.body.oldPassword)
    if(!isPasswordMatched){
        return next(new ErrorHander("Old Password is incorrect",400))
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHander("Password does not match",400))
    }
     user.password= req.body.newPassword;
     await user.save();

     sendToken(user, 200, res)
    // res.status(200).json({
    //     success:true,
    //     user
    // });
});

//Update User profile
exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{
   const newUserData={
    name:req.body.name,
    email:req.body.email,
   }

  if(req.body.avatar!==""){
    const user= await User.findById(req.user.id);
     const imageId=user.avatar.public_id;
  if(imageId!=="Sample Image"){
     await cloudinary.v2.uploader.destroy(imageId);
    }
    const myCloud= await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width:150,
        crop:"scale"
    })

    newUserData.avatar={
        public_id:myCloud.public_id,
        url:myCloud.secure_url,
    }
}

   const user= await User.findByIdAndUpdate(req.user.id, newUserData,{
    new: true,
    runValidators:true,
    useFindAndModify: false,
   })
    res.status(200).json({
        success:true,
    });
    
});

//Get all Users (admin)
exports.getAllUsers=catchAsyncErrors(async(req,res,next)=>{
const users=await User.find();
res.status(200).json({
    success:true,
    users
});
});
//Get single User (admin)
exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHander(`User does not exist Id: ${req.params.id}`))
    }
    res.status(200).json({
        success:true,   
        user
    });
    });
//Update User Role(admin)
exports.updateUserRole=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
     name:req.body.name,
     email:req.body.email,
     role:req.body.role,
    }
    // let user= await User.findById(req.params.id);

    // if(!user){
    //     return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400))
    // }

     await User.findByIdAndUpdate(req.params.id, newUserData,{
     new: true,
     runValidators:true,
     useFindAndModify: false,
    })
     res.status(200).json({
         success:true,
     });
     
 });

 //Delete User (admin)
exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
    const user= await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`))
    }
//we  remove cloudinary 
    const imageId=user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    await user.remove();
     res.status(200).json({
         success:true,
         message:"User Deleted Successfully"
     });
     
 });

