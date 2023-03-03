import React, { Fragment, useEffect, useState } from "react";
// import "./newProduct.css";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import StorageIcon from "@material-ui/icons/Storage";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SideBar from "./Sidebar";
import { getProductdetails, STATUSES, clearError as stopError } from "../../store/productDetailsSlice";
import { setIsUpdated, updateProduct, STATUSES as updateStatus, clearError } from "../../store/deleteUpdateProductSlice";

const UpdateProduct = ({history,match}) => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const {status, isUpdated}=useSelector(state=>state.deleteUpdateProduct)
    const {product}=useSelector(state=>state.productDetails);
    const [name, setName]=useState("")
    const [price, setPrice]=useState(0); 
    const [category, setCategory]=useState("");
    const [description, setDescription]=useState("");
    const [Stock, setStock]=useState(0);
    const [images, setImages]=useState([]);
    const [oldImages, setOldImages]=useState([]);
    const [imagePreview, setImagePreview]=useState([]);
    const categories=[
        "Laptop",
        "Footwear",
        "Bottom",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones"
    ]
const productId=match.params.id;
const error=STATUSES.ERROR;
const updateError=updateStatus.ERROR;
useEffect(()=>{
if(product && product._id !== productId){
    dispatch(getProductdetails(productId));
}else{
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setStock(product.Stock);
    setOldImages(product.images);
}

if(error!=="no-error"){
    alert.error(error);
    dispatch(stopError('no-error'));  
}
if(updateError!=="no-error"){
    alert.error(updateError);
    dispatch(clearError('no-error'));  
}
if(isUpdated){
    alert.success("Product Updated Successfully");
    history.push("/admin/products")
    dispatch(setIsUpdated(false));
    dispatch(getProductdetails(productId));
}
},[error,alert,history,dispatch,isUpdated,updateError,productId,product])
const updateProductSubmitHandler=(e)=>{
    e.preventDefault();
    const myForm =new FormData();

    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("Stock", Stock);
images.forEach((image)=>{
    myForm.append("images", image);
});
dispatch(updateProduct(productId, myForm));
}
const updateProductImageChange=(e)=>{
const files=Array.from(e.target.files);
setImages([]);
setImagePreview([]);
setOldImages([]);
files.forEach((file)=>{
    const reader=new FileReader();

    reader.onload=()=>{
        if(reader.readyState === 2){
            setImagePreview((old)=>[...old, reader.result]);
            setImages((old)=>[...old, reader.result]);
        }
    };
    reader.readAsDataURL(file);
});

};


return (
   <Fragment>
    <MetaData title="Create Product" />
    <div className="dashboard">
    <SideBar />
<div className="newProductContainer">
    <form className="createProductForm"
    encType="multipart/form-data"
    onSubmit={updateProductSubmitHandler}>
<h1>Create Product</h1>
<div>
    <SpellcheckIcon />
    <input type="text"
    placeholder="Product Name"
    required
    value={name}
    onChange={(e)=>setName(e.target.value)} />
</div>
<div>
    <AttachMoneyIcon />
    <input type="number"
    placeholder="Price"
    required
    value={price}
    onChange={(e)=>setPrice(e.target.value)} />
</div>
<div>
    <DescriptionIcon />
    <textarea
    placeholder="Product Description"
    cols="30"
    rows="1"
    value={description}
    onChange={(e)=>setDescription(e.target.value)} >
    </textarea>
</div>
<div>
    <AccountTreeIcon />
    <select value={category} onChange={(e)=>setCategory(e.target.value)}>
        <option value="">Choose Category</option>
        {categories.map((cate)=>(
            <option key={cate} value={cate}>{cate}</option>
        ))}
    </select>
</div>
<div>
<StorageIcon />
<input type="number"
    placeholder="Stock"
    required
    value={Stock}
    onChange={(e)=>setStock(e.target.value)} />
</div>
<div id="createProductFormFile">
    <input type="file"
    name="avatar"
    accept="image/*"
    multiple
    onChange={updateProductImageChange} />
</div>
<div id="createProductFormImage">
{oldImages && oldImages.map((image, index)=>(
    <img key={index} src={image.url} alt="Old Product Preview" /> 
))}
</div>
<div id="createProductFormImage">
{imagePreview.map((image, index)=>(
    <img key={index} src={image} alt="Product Preview" /> 
))}
</div>
<Button
id="createProductBtn"
type="submit"
disabled={status===STATUSES.LOADING ? true :false}
>
    Update
</Button>
    </form>
</div>
    </div>
   </Fragment>
  )
}

export default UpdateProduct