const ErrorHander= require("../utils/errorhander");
module.exports=(err, req, res, next)=>{
    err.statusCode= err.statusCode || 500;
    err.message= err.message || "Internal Server Error";

    //wrong Mongodb id error
 if(err.name==="CastError"){
    const message=`Resource not found. Invalid: ${err.path}`
    err=new ErrorHander(message, 400);
 }
//monngoose duplicate err
if(err.code===11000){
    const message=`Duplicate ${Object.keys(err.keyValue)} Entered`;
    err=new ErrorHander(message, 400);
}
//wrong  jwt error
if(err.name==="JsonWebTokenError"){
    const message=`Json web Token is invalid, Try again`
    err=new ErrorHander(message, 400);
}
//wrong  jwt error
if(err.name==="TokenExpierdError"){
    const message=`Json web Token is Expierd, Try again`
    err=new ErrorHander(message, 400);
}
   
   
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        //error:err.stack,
    });
}; 
