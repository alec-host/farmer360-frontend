import React,{ useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { v4 as uuidv4 } from 'uuid';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import API_END_POINT from "../../../endpoint/apiRoute";

import customCss from "../../../css/custom.loading.module.css";

import { PRODUCT_KEY, readLocalCache, storeOnLocalCache } from "../../../db/localSessionData";

const AddInventoryPage = () => {

    const inputProductDocumentId = React.useRef(null);
    const inputProductDatabaseId = React.useRef(null);
    const inputProductCollectionId = React.useRef(null);
    const inputProductReferenceNumber = React.useRef(null);

    const [hideProfile, setHideProfile] = useState(false);
 
    const [storeProductData, setStoreProductData] = useState([]);
    const [filterProduct, setFilterProduct] = useState(storeProductData);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [productReferenceNumber,setProductReferenceNumber] = useState([]);
    const [databaseId, setDatabaseId] = useState([]);
    const [documentId, setDocumentId] = useState([]);
    const [collectionId, setCollectionId] = useState([]);
    const [description, setDescription] = useState([]);

    const [textChanged, setTexChanged] = useState(0);
    const [clickedButtonName, setClickedButtonName] = useState(null);

    const [formData, setFormData] = useState({});

    const toggleProfileHide = () => {
        setHideProfile(!hideProfile);
    };

    useEffect(() => {
        const stored_data = readLocalCache(PRODUCT_KEY);
        if(stored_data){
            setStoreProductData(stored_data);
            setFilterProduct(stored_data);
        }
        Loading.init({className:customCss.notiflix_loading,});
    },[]); 
    
    const initialHiddenInput = (formId) => {
        setProductReferenceNumber(storeProductData[formId].product_reference_number);
        setDatabaseId(storeProductData[formId].$databaseId);
        setDocumentId(storeProductData[formId].$id);
        setCollectionId(storeProductData[formId].$collectionId);
    };

    const handleInputChange = (formId,e) => {
        if(typeof(e.target) !== "undefined"){
            const { name, value} = e.target;
           
            setFormData((prevData) => ({
            ...prevData,
            [formId]: {
                ...prevData[formId],
                [name]: value,
            },
            }));
        }else{
            setDescription(e);
            setFormData((prevData) => ({
                ...prevData,
                [formId]: {
                    ...prevData[formId],
                    ['ProductDescription']: description,
                },
            }));
        }
    
        setTexChanged(1);
        initialHiddenInput(formId);
    };

    const handleButtonClick = (buttonName) => {
        setClickedButtonName(buttonName);
    };

    const filterProducts = (name) => {
        let filteredProductList = null;
        if(name){
            filteredProductList = storeProductData.filter((item) => item.product_name?.trim().toLowerCase() === (name?.toLowerCase()));
        }else{
            filteredProductList = storeProductData;
        }
        setFilterProduct(filteredProductList);
    } 
    
    const handleOnChange = (e) => {
        const search = e.target.value;
        filterProducts(search.trim());
    };

    const handleSubmit = (formId,event) => {
        event.preventDefault();

        let dataForForm = formData[formId];

        let formUpdateData = {};

        if(typeof(dataForForm) !== "undefined"){
            const {ProductName,ProductPrice,ProductQuantity} = dataForForm;
            if(typeof(ProductName) !== "undefined"){
                const attributeName = ProductName;
                formUpdateData = {action:"NAME",product_name:attributeName,product_reference_number:productReferenceNumber,database_id:databaseId,table_id:collectionId,record_id:documentId};
            }else if(typeof(ProductPrice) !== "undefined"){
                const attributeName = ProductPrice;
                formUpdateData = {action:"PRICE",product_price:attributeName,product_reference_number:productReferenceNumber,database_id:databaseId,table_id:collectionId,record_id:documentId};
            }else if(typeof(ProductQuantity) !== "undefined"){
                const attributeName = ProductQuantity;
                formUpdateData = {action:"QTY",product_qty:attributeName,product_reference_number:productReferenceNumber,database_id:databaseId,table_id:collectionId,record_id:documentId};
            }else{
                const attributeName = description;
                formUpdateData = {action:"DESCRIPTION",description:attributeName,product_reference_number:productReferenceNumber,database_id:databaseId,table_id:collectionId,record_id:documentId};
            }

            httpPost(formUpdateData);
        }else{

            let publish_status = {};

            const formControlA = document.getElementsByClassName("form-control a");
            const formControlB = document.getElementsByClassName("form-control b");
            const formControlC = document.getElementsByClassName("form-control c");
            const formControlD = document.getElementsByClassName("form-control d");
            const formControlE = document.getElementsByClassName("form-control e");

            const isPublishedArr = [...formControlA].map(input => input.value);
            const productReferenceNumberArr = [...formControlB].map(input => input.value);
            const databaseIdArr = [...formControlC].map(input => input.value);
            const documentIdArr = [...formControlD].map(input => input.value);
            const collectionIdArr = [...formControlE].map(input => input.value);

            if(isPublishedArr[formId] === "0"){
                if(textChanged === 0){
                    publish_status = 1;
                }else{
                    publish_status = 0;
                }
            }else{
                if(textChanged === 0){
                    publish_status = 0;
                }else{
                    publish_status = 1;
                }
            } 

            if(clickedButtonName && clickedButtonName === "publishButton"){
                formUpdateData = {
                    action:"PUBLISH",
                    is_published:publish_status,
                    product_reference_number:productReferenceNumberArr[formId],
                    database_id:databaseIdArr[formId],
                    table_id:collectionIdArr[formId],
                    record_id:documentIdArr[formId]
                };
            
                httpPost(formUpdateData); 
            }
        }
    };

    const httpPost = (formUpdateData) => {

        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });

        setButtonDisabled(!buttonDisabled);

        fetch(`${API_END_POINT}/api/v1/modifyProduct`,{
            method:'PATCH',
            body: JSON.stringify(formUpdateData),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(async(response) => {
            await response.json().then(data => {
                if(data?.success){
                    setFormData({});
                    setStoreProductData(data?.data);
                    setFilterProduct(data?.data);
                    Notiflix.Notify.info('Update successful',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    });
                    setTimeout(() => {
                        //window.location.reload();
                    }, 2000);  
                    storeOnLocalCache(PRODUCT_KEY,storeProductData);              
                }else{
                    Notiflix.Notify.warning('Product update has Failed',{
                        ID:'FWA',
                        timeout:2950,
                        showOnlyTheLastOne:true
                    }); 
                }
                setButtonDisabled(buttonDisabled);
                Loading.remove(1523);
            });
        })
        .catch(async(error) => {
            console.error(await error);
        });
    };

    const renderForms = (data) => {
        const forms = [];
        for(let j=0;j<data.length;j++){
            forms.push(
                <form key={j} onSubmit={e=>handleSubmit(j,e)} >
                    <table style={{width:"100%"}}> 
                        <thead><tr><th/></tr></thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="card border-success mb-3">
                                        <div className="card-body">
                                            <table style={{width:"100%"}}>
                                                <thead><tr><th/></tr></thead>
                                                <tbody>
                                                    <tr>
                                                        <td align="center">
                                                            <div>
                                                                {
                                                                data[j]?.image_url !== null ?
                                                                <img
                                                                    className="card-img-top"
                                                                    src={data[j]?.image_url}
                                                                    alt="product image"
                                                                    style={{maxWidth:"0%", maxHeight:"0%"}}
                                                                />
                                                                :null
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>                                                                                              
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"90%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{width:"100%"}}>
                                                                            <label htmlFor="ProductName" className="fw-bold small">Product Name</label>
                                                                            <input 
                                                                                type="text" 
                                                                                className="form-control form-control-sm" 
                                                                                id={`ProductName-${j}`}
                                                                                name={`ProductName`}
                                                                                placeholder="Product Name"
                                                                                onChange={e=>handleInputChange(j,e)}
                                                                                defaultValue={data[j]?.product_name}
                                                                                maxLength={25}
                                                                                required 
                                                                            />
                                                                        </td>
                                                                        <td align="end">
                                                                            <label>&nbsp;</label>
                                                                            <button id={uuidv4()} className="my-2 mx-auto btn btn-outline-success btn-sm" type="submit" onClick={()=>{handleButtonClick('')}}>Update</button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>                                                            
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"90%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{width:"100%"}}>
                                                                            <label htmlFor="ProductQuantity" className="fw-bold small">Description</label>
                                                                            <ReactQuill 
                                                                                class="form-control form-control-sm"
                                                                                style={{position:"relative",top:"0px",left:"0px",bottom:"0px",width:"100%",height:"100%" }}
                                                                                id={`ProductDescription-${j}`}
                                                                                name={`ProductDescription`}
                                                                                placeholder="Product Description"
                                                                                onChange={e=>handleInputChange(j,e)}
                                                                                defaultValue={data[j]?.description}
                                                                                required 
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="end" valign="bottom">
                                                                            <button id={uuidv4()} className="my-2 mx-auto btn btn-outline-success btn-sm" type="submit" onClick={()=>{handleButtonClick('')}}>Update</button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>                                        
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"90%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{width:"100%"}}>
                                                                            <label htmlFor="ProductPrice" className="fw-bold small">Price</label>
                                                                            <input 
                                                                                type="number" 
                                                                                className="form-control form-control-sm" 
                                                                                id={`ProductPrice-${j}`}
                                                                                name={`ProductPrice`}
                                                                                placeholder="Enter Price"
                                                                                onChange={e=>handleInputChange(j,e)}
                                                                                defaultValue={data[j]?.price === 0 ? 0 : data[j]?.price}
                                                                                maxLength={10}
                                                                                required 
                                                                            />
                                                                        </td>
                                                                        <td align="end">
                                                                            <label>&nbsp;</label>
                                                                            <button id={uuidv4()} className="my-2 mx-auto btn btn-outline-success btn-sm" type="submit" onClick={()=>{handleButtonClick('')}}>Update</button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>                                                                                       
                                                            </table>
                                                        </td>
                                                    </tr> 
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"90%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{width:"100%"}}>
                                                                            <label htmlFor="ProductQuantity" className="fw-bold small">Quantity</label>
                                                                            <input 
                                                                                type="number" 
                                                                                className="form-control form-control-sm" 
                                                                                id={`ProductQuantity-${j}`}
                                                                                name={`ProductQuantity`}
                                                                                placeholder="Enter Qty"
                                                                                onChange={e=>handleInputChange(j,e)}
                                                                                defaultValue={data[j]?.quantity === 0 ? 0 : data[j]?.quantity}
                                                                                maxLength={5}
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td align="end">
                                                                            <label>&nbsp;</label>
                                                                            <button id={uuidv4()} className="my-2 mx-auto btn btn-outline-success btn-sm" type="submit" onClick={()=>{handleButtonClick('')}}>Update</button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>                                                                                       
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"90%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <div>
                                                                            <button 
                                                                                id={`pub${uuidv4()}`} 
                                                                                name={`pub${uuidv4()}`}
                                                                                className={data[j]?.is_published === 0 || data[j]?.is_published === "0" ? "btn btn-primary btn-md btn-block fw-bold": "btn btn-danger btn-md btn-block fw-bold"} 
                                                                                type="submit"
                                                                                onClick={()=>{handleButtonClick('publishButton')}}>
                                                                                {data[j]?.is_published === 0 || data[j]?.is_published === "0" ? "Publish": "Unpublish"}
                                                                            </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table> 
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <input 
                                                                type="hidden" 
                                                                className="form-control a" 
                                                                id={`ProductIsPublished-${j}`}
                                                                name="ProductIsPublished"
                                                                defaultValue={data[j]?.is_published}
                                                                ref={inputProductReferenceNumber}
                                                                readOnly
                                                            />
                                                        </td>
                                                    </tr>                                         
                                                    <tr>
                                                        <td>
                                                            <input 
                                                                type="hidden" 
                                                                className="form-control b" 
                                                                id={`ProductId-${j}`}
                                                                name="ProductId"
                                                                defaultValue={data[j]?.product_reference_number}
                                                                ref={inputProductReferenceNumber}
                                                                readOnly
                                                            />
                                                        </td>
                                                    </tr>                                         
                                                    <tr>
                                                        <td>
                                                            <input 
                                                                type="hidden" 
                                                                className="form-control c" 
                                                                id={`DatabaseId-${j}`}
                                                                name="DatabaseId"
                                                                defaultValue={data[j]?.$databaseId}
                                                                ref={inputProductDatabaseId}
                                                                readOnly
                                                            />
                                                        </td>
                                                    </tr> 
                                                    <tr>
                                                        <td>
                                                            <input 
                                                                type="hidden" 
                                                                className="form-control d" 
                                                                id={`DocumentId-${j}`}
                                                                name="DocumentId"
                                                                defaultValue={data[j]?.$id}
                                                                ref={inputProductDocumentId}
                                                                readOnly
                                                            />
                                                        </td>
                                                    </tr> 
                                                    <tr>
                                                        <td>
                                                            <input 
                                                                type="hidden" 
                                                                className="form-control e" 
                                                                id={`CollectionId-${j}`}
                                                                name="CollectionId"
                                                                defaultValue={data[j]?.$collectionId}
                                                                ref={inputProductCollectionId}
                                                                readOnly
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                );
            }
        return forms;
    };
    
    return (
        <>
            <div className="container-fluid">
                <div className="container mt-3">
                    <div className="row">
                        <table style={{width:"100%"}}>
                            <thead><tr><th/></tr></thead>
                            <tbody>
                                <tr><td><h5><strong>Inventory List</strong></h5></td></tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                <tr style={{display: storeProductData[0]?.product_name  ? "" : "none"}}>
                                    <td><h5><strong></strong></h5></td>
                                    <td style={{textAlign:"end"}}>
                                        <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleProfileHide}> View</NavLink>
                                    </td>
                                </tr> 
                                <tr style={{display: storeProductData[0]?.product_name  ? "none" : ""}}>
                                    <td colSpan={2} style={{textAlign:"center"}}>
                                        The Inventory is Empty, please add a Product.
                                    </td>
                                </tr>                     
                                <tr>
                                    <td colSpan={2}>
                                        <div className="content" style={{display: hideProfile ? "" :"none"}}>
                                            <p></p>
                                            <div className="bg-white-opacity-40 backdrop-filter backdrop-blur-l px-4 pt-4 pb-6 rounded shadow max-w-[1100px] border border mx-auto fw-bold fs-6">
                                                    Search
                                                    <table style={{width:"100%"}}>     
                                                        <thead><tr><th/></tr></thead>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <input type="search" className="form-control" aria-label="Search" onChange={handleOnChange} placeholder="Search by product name..." />
                                                                </td>
                                                            </tr>
                                                        </tbody> 
                                                    </table>
                                                <br/>
                                            </div>
                                            <p></p>
                                            {filterProduct?.map((data) => (renderForms([data])))}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddInventoryPage;
