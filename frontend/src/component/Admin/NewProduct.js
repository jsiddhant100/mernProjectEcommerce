import React, { Fragment, useEffect, useState } from "react";
import "./newProduct.css";
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
import { createProduct, setProductUpdate, STATUSES, clearError } from "../../store/newProductSlice";
const NewProduct = ({history}) => {
    const dispatch=useDispatch();
    const alert=useAlert();
    const {status, success}=useSelector(state=>state.newProduct)
    const [name, setName]=useState("")
    const [price, setPrice]=useState(0); 
    const [category, setCategory]=useState("");
    const [description, setDescription]=useState("");
    const [Stock, setStock]=useState(0);
    const [images, setImages]=useState([]);
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
const error=STATUSES.ERROR
useEffect(()=>{
if(error!=="no-error"){
    alert.error(error);
 dispatch(clearError('no-error'));  
}
if(success){
    alert.success("Product Created Successfully");
    history.push("/admin/dashboard")
    dispatch(setProductUpdate(false));
}
},[error,alert,history,dispatch,success])
const createProductSubmitHandler=(e)=>{
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
dispatch(createProduct(myForm));
}
const createProductImageChange=(e)=>{
const files=Array.from(e.target.files);
setImages([]);
setImagePreview([]);
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
    onSubmit={createProductSubmitHandler}>
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
    <select onChange={(e)=>setCategory(e.target.value)}>
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
    onChange={(e)=>setStock(e.target.value)} />
</div>
<div id="createProductFormFile">
    <input type="file"
    name="avatar"
    accept="image/*"
    multiple
    onChange={createProductImageChange} />
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
    Create
</Button>
    </form>
</div>
    </div>
   </Fragment>
  )
}

export default NewProduct