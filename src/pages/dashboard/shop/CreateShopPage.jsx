import React,{ useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import 'react-quill/dist/quill.snow.css';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import countryList from "../../../db/countryList";
import { STORE_KEY, readLocalCache, readLocalStoredData, storeOnLocalCache } from "../../../db/localSessionData";
import formattedDateTime from "../../../utility/format-current-date";
import API_END_POINT from "../../../endpoint/apiRoute";

const CreateShopPage = () => {

  const inputShopName = React.useRef(null);
  const inputContactPhone = React.useRef(null);
  const inputAboutUs = React.useRef();  
  const inputWebsiteUrl = React.useRef(null);
  const inputFacebookLink = React.useRef(null);

  const [country,setCountry] = useState([]);
  const [hideCreateShop, setHideCreateShop] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [storeShopData, setStoreShopData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [trackDataChange,setTrackDataChange] = useState(false);
  const [inputUpdate,setInputUpdate] = useState("");
  const [hideSocialSection,sethideSocialSection] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  const toggleShopHide = () => {
    setHideCreateShop(!hideCreateShop);
    if(typeof(storeShopData[0]?.name) === 'undefined'){
        setInputUpdate("contact");
    }else{
        setInputUpdate("update_contract");
    }
    if(hideSocialSection){
        sethideSocialSection(!hideSocialSection);
    }
  };

  const toggleSocialHide = () => {
    sethideSocialSection(!hideSocialSection);
    setInputUpdate("socials");
    if(hideCreateShop){
        setHideCreateShop(!hideCreateShop);
    }
  };

  useEffect(() => {
    setCurrentDate(formattedDateTime);
    setCountry(countryList);
    const stored_data = readLocalStoredData();
    if(stored_data){
      setStoreData(stored_data);
    }
  },[]); 

  useEffect(() => {
    const stored_data = readLocalCache(STORE_KEY);
    if(stored_data){
        setStoreShopData(stored_data);
    }
  },[]);

  const onSubmitHandler = (event) => {

    let formData = {};

    event.preventDefault();

    setButtonDisabled(true);

    Loading.standard({
        backgroundColor: 'rgba(0,0,0,0)',
    });

    formData.action = inputUpdate;
    formData.phone = storeData[0]?.msisdn || "";
    formData.email = storeData[0]?.email || "";
    formData.owner_reference_number = storeData[0]?.reference_number|| "";
    formData.date_created = currentDate;
    switch(inputUpdate){
        case "contact":
            formData.name = inputShopName?.current?.value || "";
            formData.phone_number = inputContactPhone?.current?.value || "";
            formData.about = inputAboutUs?.current?.value || "Not provided";

            createShop(formData);
        break;
        case "update_contract":
            formData.name = inputShopName?.current?.value || "";
            formData.phone_number = inputContactPhone?.current?.value || "";
            formData.about = inputAboutUs?.current?.value || "Not provided"; 
            formData.database_id = storeShopData[0]?.$databaseId || "";
            formData.table_id = storeShopData[0]?.$collectionId || "";
            formData.record_id = storeShopData[0]?.$id || "";

            updateShop(formData);
        break;
        case "socials":  
            formData.phone_number = storeShopData[0]?.phone_number || "";       
            formData.website_url = inputWebsiteUrl?.current?.value || "";
            formData.facebook_link = inputFacebookLink?.current?.value || "";
            formData.database_id = storeShopData[0]?.$databaseId || "";
            formData.table_id = storeShopData[0]?.$collectionId || "";
            formData.record_id = storeShopData[0]?.$id || "";

            updateShop(formData);
        break;
        default:
        break;
    }
  };

  const createShop = (formData) => {
    console.log(formData);
    fetch(`${API_END_POINT}/api/v1/createNewShop`,{
        method:'POST',
        body: JSON.stringify(formData),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(async(response) => {
        await response.json().then(data=>{
            console.log(data);
            if(data?.success){
                inputShopName.current.value='';
                inputContactPhone.current.value='';
                setStoreShopData(data?.data);
                Notiflix.Notify.info('Update successful',{
                    ID:'SWA',
                    timeout:2950,
                    showOnlyTheLastOne:true                      
                }); 
                setTrackDataChange(!trackDataChange); 
                setTimeout(() => {
                    window.location.reload();
                }, 2000);                
            }else{
                Notiflix.Notify.warning('Update has Failed',{
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

  const updateShop = (formData) => {
    console.log(formData);
    fetch(`${API_END_POINT}/api/v1/modifyShop`,{
        method:'PATCH',
        body: JSON.stringify(formData),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(async(response) => {
        await response.json().then(data=>{
            if(data?.success){
                inputShopName.current.value='';
                inputContactPhone.current.value='';
                inputAboutUs.current.value='';
                console.log(data?.data);
                setStoreShopData(data?.data);
                Notiflix.Notify.info('Update successful',{
                    ID:'SWA',
                    timeout:2950,
                    showOnlyTheLastOne:true                      
                }); 
                setTrackDataChange(!trackDataChange); 
                setTimeout(() => {
                    window.location.reload();
                }, 2000);                
            }else{
                Notiflix.Notify.warning('Update has Failed',{
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
    storeOnLocalCache(STORE_KEY,storeShopData);
  }
 
  return (
    <>
      <div className="container-fluid">
        <div className="container" style={{marginTop:"15px"}}>
          <div className="row">
                <table style={{width:"100%"}} >
                    <thead><tr><th/></tr></thead>
                    <tbody>
                        <tr><td><h5><strong>Shop Information</strong></h5></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr>
                            <td colSpan={2}>
                                {
                                storeData[0]?.subscription === "basic" ?
                                <div className="content">
                                    {
                                    storeData[0]?.is_profile_completed === 1 ?
                                    <>
                                    <p>To unlock the Shop upgrade current subscription from Basic package to Advance package.</p>
                                    <NavLink to="/dashboard/edit-profile/upgrade" className="btn btn-primary m-2">Change Subscription</NavLink>
                                    <hr/>
                                    </>
                                    : null
                                    }
                                </div>
                                :
                                <div></div>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td><h5><strong>Shop</strong></h5></td>
                            <td style={{textAlign:"end"}}>
                                {storeShopData[0]?.name ? 
                                <button className="btn btn-success m-2" onClick={toggleShopHide}><i className=""></i> Edit</button>
                                :
                                <button className="btn btn-success m-2" onClick={toggleShopHide} disabled={storeData[0]?.subscription === "basic" ? true : false} ><i className=""></i> Add</button>
                                }
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan={2}>
                                <table style={{width:"100%",display: hideCreateShop ? "none" : ""}}>
                                    <thead><tr><th/></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td><strong></strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>                                  
                        <tr>
                            <td colSpan={2} style={{display: storeData[0]?.subscription === "advance" ? "" : "none"}}>
                                <form onSubmit={onSubmitHandler}> 
                                    <table style={{width:"100%",display: hideCreateShop  ? "" : "none"}}>
                                        <thead><tr><th/></tr></thead>
                                        <tbody>                     
                                            <tr>
                                                <td colSpan={2}>
                                                <label htmlFor="ShopName"><small><strong>Shop name</strong></small></label>
                                                    <input
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="ShopName"
                                                        name="ShopName"
                                                        defaultValue={storeShopData[0]?.name}
                                                        ref={inputShopName}
                                                        placeholder={"Shop Name"}
                                                        maxLength={20}
                                                        required
                                                    />
                                                </td>
                                            </tr> 
                                            <tr>
                                                <td colSpan={2}>
                                                <label htmlFor="ContactPhone"><small><strong>Contact Phone</strong></small></label>
                                                    <input
                                                        style={{width:"100%"}}
                                                        type="phone" 
                                                        className="form-control"
                                                        id="ContactPhone"
                                                        name="ContactPhone"
                                                        defaultValue={storeShopData[0]?.phone_number ? storeShopData[0]?.phone_number : storeData[0]?.msisdn }
                                                        ref={inputContactPhone}
                                                        placeholder={"Phone Number"}
                                                        maxLength={15}
                                                        required
                                                    />
                                                </td>
                                            </tr> 
                                            <tr>
                                                <td colSpan={2}>
                                                <label htmlFor="AboutUs"><small><strong>About Us</strong></small></label> 
                                                    <textarea
                                                        className="form-control"
                                                        id="AboutUs"
                                                        name="AboutUs"
                                                        defaultValue={storeShopData[0]?.about}
                                                        ref={inputAboutUs} 
                                                        style={{width:"100%",padding:"10px",outline:"none !import",border:"1 solid gray",boxShadow:"0 0 1px #719ECE",minHeight:"100px"}}
                                                        placeholder="Write a short introduction to help your customers know who you are and what you are about ..."
                                                        maxLength={1000}
                                                        required
                                                    />  
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input
                                                        type="hidden"
                                                        id="Operation"
                                                        name="Operation"
                                                        value={inputUpdate}
                                                        readOnly                               
                                                    />
                                                </td>
                                            </tr>                                      
                                            <tr><td colSpan={2}><hr/></td></tr>
                                            <tr>
                                                <td style={{textAlign:"end",width:"90%"}}>
                                                    <button id="btnCancelProfile" className="my-2 mx-auto btn btn-dark" type="button" onClick={toggleShopHide}>
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
                        <tr><td colSpan={2}><hr/></td></tr>
                        <tr style={{width:"100%",display: storeShopData[0]?.name && storeData[0]?.subscription === "advance" ? "" : "none"}} >
                            <td colSpan={2}>
                                <table style={{display: hideSocialSection ?  "none" : ""}}>
                                    <thead><tr><th/></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td style={{width:"100%",textAlign:"start"}}>
                                                <h5><strong>Website & Social Links</strong></h5>
                                            </td>
                                            <td style={{width:"100%",textAlign:"end"}}>
                                                {storeShopData[0]?.website_url ||storeShopData[0]?.facebook_link ? 
                                                <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleSocialHide}><i className=""></i> Edit</NavLink>
                                                :
                                                <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleSocialHide}><i className=""></i> Add</NavLink>
                                                }
                                            </td>
                                        </tr> 
                                        <tr>
                                            <td colSpan={2}>
                                                <table style={{width:"100%"}}>
                                                    <thead><tr><th/></tr></thead>
                                                    <tbody>
                                                        <tr>
                                                            <td style={{textAlign:"left"}}>Website URL:   {storeShopData[0]?.website_url ?  storeShopData[0]?.website_url : storeData[0]?.website_url } </td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{textAlign:"left"}}>Facebook Link: {storeShopData[0]?.facebook_link ?  storeShopData[0]?.facebook_link : storeData[0]?.facebook_link }</td>
                                                        </tr>
                                                    </tbody>  
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody> 
                                </table>
                            </td>
                        </tr>                
                        <tr>
                            <td colSpan={2}>
                                <form onSubmit={onSubmitHandler}> 
                                    <table style={{width:"100%",display: hideSocialSection ? "" : "none"}}>
                                        <thead><tr><th/></tr></thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan={2}>
                                                    <input
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="WebsiteUrl"
                                                        name="WebsiteUrl"
                                                        defaultValue={storeShopData[0]?.website_url ?  storeShopData[0]?.website_url : storeData[0]?.website_url }
                                                        ref={inputWebsiteUrl}
                                                        placeholder="Website URL"
                                                        maxLength={35}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr><td height={"18px"}></td></tr> 
                                            <tr>
                                                <td colSpan={2}>
                                                    <input 
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="FacebookLink"
                                                        name="FacebookLink"
                                                        defaultValue={storeShopData[0]?.facebook_link ?  storeShopData[0]?.facebook_link : storeData[0]?.facebook_link }
                                                        ref={inputFacebookLink}
                                                        placeholder="Facebook Link"
                                                        maxLength={35}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input
                                                        type="hidden"
                                                        id="Operation"
                                                        name="Operation"
                                                        value={inputUpdate}
                                                        readOnly                               
                                                    />
                                                </td>
                                            </tr> 
                                            <tr>
                                                <td style={{textAlign:"end",width:"90%"}}>
                                                <button id="btnCancelLocation" className="my-2 mx-auto btn btn-dark" type="button" onClick={toggleSocialHide}>
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

export default CreateShopPage;
