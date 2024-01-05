import React,{ useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import formattedDateTime from "../../../utility/format-current-date";
import { PRODUCT_KEY, STORE_KEY, readLocalCache } from "../../../db/localSessionData";
import API_END_POINT from "../../../endpoint/apiRoute";

import customCss from "../../../css/custom.loading.module.css";

const AddProductPage = () => {

  const inputProductName = React.useRef(null);
  const inputProductPrice = React.useRef(null);
  const inputProductQuantity = React.useRef(null);
  const inputDescription = React.useRef(null);

  const [hideProfile, setHideProfile] = useState(false);
  const [hideLocation, setHideLocation] = useState(false);
  const [hideCity, setHideCity] = useState(false);
  const [hideCountry, setHideCountry] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [storeShopData, setStoreShopData] = useState([]);
  const [storeProductData, setStoreProductData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [trackDataChange,setTrackDataChange] = useState(false);
  const [inputUpdate,setInputUpdate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const toggleProfileHide = () => {
    setHideProfile(!hideProfile);
    setInputUpdate("contact");
  };

  const toggleLocationHide = () => {
    setHideLocation(!hideLocation);
    setInputUpdate("location");
  };

  const toggleCityHide = () => {
    setHideCity(!hideCity);
  };

  const toggleCountryHide = () => {
    setHideCountry(!hideCountry);
  };

  useEffect(() => {
    const stored_data = readLocalCache(STORE_KEY);
    console.log(storeData);
    if(stored_data){
      setStoreShopData(stored_data);
    }
    Loading.init({className:customCss.notiflix_loading,});
  },[]);

  useEffect(() => {
    const stored_data = readLocalCache(PRODUCT_KEY);
    if(stored_data){
      setStoreProductData(stored_data);
    }
  },[]); 

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]);
  };
  
  const onSubmitHandler = (event) => {

    const formData = new FormData();

    event.preventDefault();

    setButtonDisabled(true);

    Loading.standard({
        backgroundColor: 'rgba(0,0,0,0)',
    });

    formData.append('product_name', inputProductName?.current?.value || "");
    formData.append('product_price', inputProductPrice?.current?.value || "");
    formData.append('product_qty', inputProductQuantity?.current?.value || "");
    formData.append('description', inputDescription?.current?.value || "");
    formData.append('file', selectedFile || null);
    formData.append('original_file_name', selectedFile.name || null);
    formData.append('shop_uuid', storeShopData[0]?.shop_uuid);
    formData.append('owner_reference_number', storeShopData[0]?.owner_reference_number);
    formData.append('date_created',formattedDateTime);

    console.log(JSON.stringify(formData));
    console.log(formData);
    console.log(selectedFile.name);
    
    fetch(`${API_END_POINT}/api/v1/addProduct`,{
        method:'POST',
        body: formData
    })
    .then(async(response) => {
        await response.json().then(data=>{
            if(data?.success){
                inputProductName.current.value='';
                inputDescription.current.value='';
                inputProductName.current.value='';
                inputProductPrice.current.value='';
                inputProductQuantity.current.value='';
                setSelectedFile(null);
                console.log(data?.data);
                setStoreProductData(data?.data);
                Notiflix.Notify.info('Product added successful',{
                    ID:'SWA',
                    timeout:2950,
                    showOnlyTheLastOne:true                      
                }); 
                setTrackDataChange(!trackDataChange); 
                setTimeout(() => {
                    window.location.reload();
                }, 2000);                
            }else{
                Notiflix.Notify.warning('Product addition has Failed',{
                    ID:'FWA',
                    timeout:2950,
                    showOnlyTheLastOne:true
                }); 
            }
            setButtonDisabled(false);
            Loading.remove(1523);
        });
    })
    .catch(async(error) => {
        console.error(await error);
    });
  };

  if(trackDataChange === true){
    //storeOnLocalCache(PRODUCT_KEY,storeProductData);
  }

  return (
    <>
      <div className="container-fluid">
        <div className="container" style={{marginTop:"15px"}}>
          <div className="row">
                <table style={{width:"100%"}}>
                    <thead><tr><th/></tr></thead>
                    <tbody>
                        <tr><td><h5><strong>Product Information</strong></h5></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr style={{display: storeShopData[0]?.name  ? "" : "none"}}>
                            <td><h5><strong>Products</strong></h5></td>
                            <td style={{textAlign:"end"}}>
                                <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleProfileHide}><i className="" ></i>  Add</NavLink>
                            </td>
                        </tr> 
                        <tr style={{display: storeShopData[0]?.name  ? "none" : ""}}>
                            <td colSpan={2} style={{textAlign:"center"}}>
                                Please create a Shop first; then proceed to add a Product.
                            </td>
                        </tr>                     
                        <tr>
                            <td colSpan={2}>
                                <table style={{width:"100%",display: hideProfile ? "none" : ""}}>
                                    <thead><tr><th/></tr></thead>
                                    <tbody>
                                        <tr><td></td></tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>                                  
                        <tr>
                            <td colSpan={2}>
                                <form onSubmit={onSubmitHandler}> 
                                    <table style={{width:"100%",display: hideProfile ? "" : "none"}}>
                                        <thead><tr><th/></tr></thead> 
                                        <tbody>                     
                                            <tr>
                                                <td colSpan={2}>
                                                <label htmlFor="ProductName"><small><strong>Product Name</strong> (title)</small></label>
                                                    <input
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="ProductName"
                                                        name="ProductName"
                                                        ref={inputProductName}
                                                        placeholder={"Product Name"}
                                                        maxLength={25}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <label htmlFor="ProductPrice"><small><strong>Price</strong></small></label>
                                                    <input
                                                        style={{width:"100%"}}
                                                        type="number" 
                                                        className="form-control"
                                                        id="ProductPrice"
                                                        name="ProductPrice"
                                                        ref={inputProductPrice}
                                                        placeholder={"Price"}
                                                        maxLength={10}
                                                        required
                                                    />
                                                </td>                                      
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <label htmlFor="Quantity"><small><strong>Quantity</strong></small></label>
                                                    <input
                                                        style={{width:"100%"}}
                                                        type="number" 
                                                        className="form-control"
                                                        id="ProductQuantity"
                                                        name="ProductQuantity"
                                                        ref={inputProductQuantity}
                                                        placeholder={"Qty"}
                                                        maxLength={5}
                                                        required
                                                    />
                                                </td>  
                                            </tr>
                                            <tr><td height={"18px"}></td></tr> 
                                        </tbody>
                                    </table>

                                    <div style={{position:"relative",paddingBottom:"0%",width:"100%",height:"100%",display: hideProfile ? "" : "none"}}>
                                        <label htmlFor="Description"><small><strong>Description</strong></small></label>  
                                        <ReactQuill 
                                            class="form-control"
                                            style={{position:"sticky",top:"25px",left:"0px",bottom:"0px",width:"100%",height:"100%" }}
                                            id="Description"
                                            name="Description"
                                            ref={inputDescription}
                                            required
                                        />
                                    </div>

                                    <table style={{width:"100%",display: hideProfile ? "" : "none"}}>
                                        <thead><tr><th/></tr></thead>
                                        <tbody>
                                            <tr><td height={"18px"}></td></tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <label htmlFor="ProductImage"><small><strong>Media</strong> (product image)</small></label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        id="ProductImage"
                                                        name="ProductImage"
                                                        accept=".png, .jpeg, .jpg"
                                                        onChange={handleFileChange}
                                                        required
                                                    />
                                                </td>
                                            </tr>                                    
                                            <tr>
                                                <td style={{textAlign:"end",width:"90%"}}>
                                                    <button id="btnCancelProfile" className="my-2 mx-auto btn btn-dark" type="button" onClick={toggleProfileHide}>
                                                        Cancel
                                                    </button>
                                                </td>
                                                <td style={{textAlign:"end"}}>
                                                    <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={buttonDisabled}>
                                                        Save
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
                            </td> 
                        </tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                    </tbody>
                </table>          
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductPage;
