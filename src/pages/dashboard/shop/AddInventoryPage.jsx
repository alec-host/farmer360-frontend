import React,{ useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { v4 as uuidv4 } from 'uuid';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import { PRODUCT_KEY, STORE_KEY, readLocalCache, storeOnLocalCache } from "../../../db/localSessionData";
import API_END_POINT from "../../../endpoint/apiRoute";

import customCss from "../../../css/custom.loading.module.css";

const AddInventoryPage = () => {

    const inputProductDocumentId = React.useRef(null);
    const inputProductDatabaseId = React.useRef(null);
    const inputProductCollectionId = React.useRef(null);
    const inputProductReferenceNumber = React.useRef(null);

    const [hideProfile, setHideProfile] = useState(false);
 
    const [storeProductData, setStoreProductData] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [trackDataChange,setTrackDataChange] = useState(false);

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

            console.log(isPublishedArr[formId]);
            console.log(productReferenceNumberArr[formId]);
            console.log(databaseIdArr[formId]);
            console.log(documentIdArr[formId]);
            console.log(collectionIdArr[formId]);

            if(isPublishedArr[formId] === "0"){
                if(textChanged.length === 0){
                    publish_status = 1;
                }else{
                    publish_status = 0;
                }
            }else{
                if(textChanged.length === 0){
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
                
                console.log(JSON.stringify(formUpdateData));  

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
            await response.json().then(data=>{
                console.log(data);
                if(data?.success){
                    setFormData({});
                    setStoreProductData(data?.data);
                    Notiflix.Notify.info('Update successful',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    }); 
                    setTrackDataChange(!trackDataChange); 
                    setTimeout(() => {
                        //window.location.reload();
                    }, 2000);                
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

    if(trackDataChange === true){
        storeOnLocalCache(PRODUCT_KEY,storeProductData);
    }

    console.log('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDd');
    console.log(storeProductData.length);
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

    const renderForms = () => {
        const forms = [];
        for(let j=0;j<storeProductData.length;j++){
            forms.push(
                <form key={j} onSubmit={e=>handleSubmit(j,e)} >
                    <table style={{width:"100%"}}> 
                        <thead><tr><th/></tr></thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="card w-100">
                                        <div className="column">
                                            <table style={{width:"100%"}}>
                                                <thead><tr><th/></tr></thead>
                                                <tbody>
                                                    <tr><td height={"25px"}></td></tr>
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"100%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="center">
                                                                            <div className="body">
                                                                                {
                                                                                storeProductData[j]?.image_url !== null ?
                                                                                <img
                                                                                    className="card-img-top"
                                                                                    src={storeProductData[j]?.image_url}
                                                                                    alt="Card"
                                                                                    style={{maxWidth:"60%", maxHeight:"60%"}}
                                                                                />
                                                                                :null
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>                                                                                              
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"85%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{width:"100%"}}>
                                                                            <label htmlFor="ProductName"><small><strong>Product Name</strong></small></label>
                                                                            <input 
                                                                                type="text" 
                                                                                className="form-control" 
                                                                                id={`ProductName-${j}`}
                                                                                name={`ProductName`}
                                                                                placeholder="Product Name"
                                                                                onChange={e=>handleInputChange(j,e)}
                                                                                defaultValue={storeProductData[j].product_name}
                                                                                maxLength={25}
                                                                                required 
                                                                            />
                                                                        </td>
                                                                        <td align="end">
                                                                            <label>&nbsp;</label>
                                                                            <button id={uuidv4()} className="my-2 mx-auto btn btn-outline-success" type="submit">Update</button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"85%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{width:"100%"}}>
                                                                            <label htmlFor="ProductQuantity"><small><strong>Description</strong></small></label>
                                                                            <ReactQuill 
                                                                                className="form-control"
                                                                                style={{position:"sticky",top:"0px",left:"0px",bottom:"0px",width:"100%",height:"100%",padding:"4px" }}
                                                                                id={`ProductDescription-${j}`}
                                                                                name={`ProductDescription`}
                                                                                placeholder="Product Description"
                                                                                onChange={e=>handleInputChange(j,e)}
                                                                                defaultValue={storeProductData[j].description}
                                                                                required 
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td align="end" valign="bottom">
                                                                            <button id={uuidv4()} className="my-2 mx-auto btn btn-outline-success" type="submit">Update</button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>                                        
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"85%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{width:"100%"}}>
                                                                            <label htmlFor="ProductPrice"><small><strong>Price</strong></small></label>
                                                                            <input 
                                                                                type="number" 
                                                                                className="form-control" 
                                                                                id={`ProductPrice-${j}`}
                                                                                name={`ProductPrice`}
                                                                                placeholder="Enter Price"
                                                                                onChange={e=>handleInputChange(j,e)}
                                                                                defaultValue={storeProductData[j].price === 0 ? 0 : storeProductData[j].price}
                                                                                maxLength={10}
                                                                                required 
                                                                            />
                                                                        </td>
                                                                        <td align="end">
                                                                            <label>&nbsp;</label>
                                                                            <button id={uuidv4()} className="my-2 mx-auto btn btn-outline-success" type="submit">Update</button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>                                                                                       
                                                            </table>
                                                        </td>
                                                    </tr> 
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"85%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{width:"100%"}}>
                                                                            <label htmlFor="ProductQuantity"><small><strong>Quantity</strong></small></label>
                                                                            <input 
                                                                                type="number" 
                                                                                className="form-control" 
                                                                                id={`ProductQuantity-${j}`}
                                                                                name={`ProductQuantity`}
                                                                                placeholder="Enter Qty"
                                                                                onChange={e=>handleInputChange(j,e)}
                                                                                defaultValue={storeProductData[j].quantity === 0 ? 0 : storeProductData[j].quantity}
                                                                                maxLength={5}
                                                                                required
                                                                            />
                                                                        </td>
                                                                        <td align="end">
                                                                            <label>&nbsp;</label>
                                                                            <button id={uuidv4()} className="my-2 mx-auto btn btn-outline-success" type="submit">Update</button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>                                                                                       
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td align="center">
                                                            <table style={{width:"85%"}}>
                                                                <thead><tr><th/></tr></thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <button 
                                                                                id={`pub${uuidv4()}`} 
                                                                                name={`pub${uuidv4()}`}
                                                                                className={storeProductData[j].is_published === 0 || storeProductData[j].is_published === "0" ? "my-2 mx-auto btn btn-primary btn-md btn-block": "my-2 mx-auto btn btn-danger btn-md btn-block"} 
                                                                                type="submit"
                                                                                onClick={()=>{handleButtonClick('publishButton')}}>
                                                                                {storeProductData[j].is_published === 0 || storeProductData[j].is_published === "0" ? "Publish": "Unpublish"}
                                                                            </button>
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
                                                                defaultValue={storeProductData[j].is_published}
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
                                                                defaultValue={storeProductData[j].product_reference_number}
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
                                                                defaultValue={storeProductData[j].$databaseId}
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
                                                                defaultValue={storeProductData[j].$id}
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
                                                                defaultValue={storeProductData[j].$collectionId}
                                                                ref={inputProductCollectionId}
                                                                readOnly
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr><td height={"10px"}></td></tr>
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
            <div className="container-fluid" style={{width:"100%"}}>
                <div className="container" style={{marginTop:"15px"}}>
                    <div className="row">
                            <table style={{width:"100%"}}>
                                <thead><tr><th/></tr></thead>
                                <tbody>
                                    <tr><td><h5><strong>Inventory List</strong></h5></td></tr>
                                    <tr><td colSpan={2}><hr /></td></tr>
                                    <tr style={{display: storeProductData[0]?.product_name  ? "" : "none"}}>
                                        <td><h5><strong></strong></h5></td>
                                        <td style={{textAlign:"end"}}>
                                            <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleProfileHide}><i className="" ></i>  View</NavLink>
                                        </td>
                                    </tr> 
                                    <tr style={{display: storeProductData[0]?.product_name  ? "none" : ""}}>
                                        <td colSpan={2} style={{textAlign:"center"}}>
                                            The Inventory is Empty, please add a Product.
                                        </td>
                                    </tr>                     
                                    <tr>
                                        <td colSpan={2}>
                                            <table style={{width:"100%",display: hideProfile ? "" :"none"}}>
                                                <thead><tr><th/></tr></thead>
                                                <tbody>
                                                    <tr>
                                                        <td>{renderForms()}</td>
                                                    </tr>
                                                    <tr><td height={"10px"}>&nbsp;</td></tr>
                                                </tbody>
                                            </table>
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

export default AddInventoryPage;
