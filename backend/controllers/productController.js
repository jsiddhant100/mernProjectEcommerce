//const { status } = require("express/lib/response");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
//CREATE PRODUCT --ADMIN
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
  const imageLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imageLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imageLinks;

  req.body.user = req.user.id; //which admin user product created
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//get all product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // try{
  // return next(new ErrorHander("this is my temp error", 500));
  const resultPerPage = 8;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  // const products= await Product.find();
  let products = await apiFeature.query;
  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
  // }catch(err){
  //     console.log(error);
  // }
});

//get all product(Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  // try{
  // return next(new ErrorHander("this is my temp error", 500));
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
  // }catch(err){
      // console.log(error);
  // }
});

//GET PRODUCT DETAILS
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    // return res.status(500).json({
    //     success:false,
    //     message:"Product not found"
    // })

    return next(new ErrorHander("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// //update product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }
// console.log(product.images)
  if(images !== undefined){
 
        // delete image from cloudinary
        for (let i = 0; i < product.images.length; i++) {
          await cloudinary.v2.uploader.destroy(product.images[i].public_id)
       }
  
   const imageLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imageLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images=imageLinks;
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin

// exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
//   let product = await Product.findById(req.params.id);

//   if (!product) {
//     return next(new ErrorHander("Product not found", 404));
//   }

//   // Images Start Here
//   let images = [];

//   if (typeof req.body.images === "string") {
//     images.push(req.body.images);
//   } else {
//     images = req.body.images;
//   }

//   if (images !== undefined) {
//     // Deleting Images From Cloudinary
//     for (let i = 0; i < product.images.length; i++) {
//       await cloudinary.v2.uploader.destroy(product.images[i].public_id);
//     }

//     const imagesLinks = [];

//     for (let i = 0; i < images.length; i++) {
//       const result = await cloudinary.v2.uploader.upload(images[i], {
//         folder: "products",
//       });

//       imagesLinks.push({
//         public_id: result.public_id,
//         url: result.secure_url,
//       });
//     }

//     req.body.images = imagesLinks;
//   }

//   product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });

//   res.status(200).json({
//     success: true,
//     product,
//   });
// });


//DELETE PRODUCT
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }
  // console.log(product.images)
  //deleting images from cloudinary
  for (let i = 0; i < product.images.length; i++) {
   await cloudinary.v2.uploader.destroy(product.images[i].public_id)
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "product deleted successfully",
  });
});

//Create new review and Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment,
  };
  const product = await Product.findById(productId);
  // let isReviewed;
  //product.reviews.forEach((rev)=> isReviewed= rev.user.toString() === req.user._id.toString());
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  //console.log(isReviewed);
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  //4,5,5,2=16/4=4

  let avg = 0;
  // product.ratings=                //use map()
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return new ErrorHander("Product not found", 404);
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return new ErrorHander("Product not found", 404);
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );
  let avg = 0;
  // console.log(reviews) 
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings =0;
  if(reviews.length===0){
    ratings=0;
  }else{
    ratings = avg / reviews.length;
  }
   
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
