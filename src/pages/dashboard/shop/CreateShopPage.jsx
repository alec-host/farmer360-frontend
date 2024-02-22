import React,{ useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import 'react-quill/dist/quill.snow.css';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import formattedDateTime from "../../../utility/format-current-date";
import API_END_POINT from "../../../endpoint/apiRoute";
import { getSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";
import { STORE_KEY, readLocalCache, storeOnLocalCache } from "../../../db/localSessionData";
import customCss from "../../../css/custom.loading.module.css";

const CreateShopPage = () => {

  const inputShopName = React.useRef(null);
  const inputContactPhone = React.useRef(null);
  const inputAboutUs = React.useRef();  
  const inputWebsiteUrl = React.useRef(null);
  const inputFacebookLink = React.useRef(null);
  const inputInstagramLink = React.useRef(null);

  const [hideCreateShop, setHideCreateShop] = useState(false);
  const [storeProfileData, setStoreProfileData] = useState([]);
  const [storeShopData, setStoreShopData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [inputUpdate,setInputUpdate] = useState("");
  const [hideSocialSection,sethideSocialSection] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  const [facebookSocialLink, setFacebookSocialLink] = useState('');
  const [instagramSocialLink, setInstagramSocialLink] = useState('');
  const [isFacebookUrlValid, setIsFacebookUrlValid] = useState(false);
  const [isInstagramUrlValid, setIsInstagramUrlValid] = useState(false);

  const [social, setSocial] = useState('');

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
    const stored_data = getSession(PROFILE_SESSION);
    if(stored_data){
      setStoreProfileData(stored_data);
    }
    Loading.init({className:customCss.notiflix_loading,});
  },[]); 

  useEffect(() => {
    const stored_data = readLocalCache(STORE_KEY);
    if(stored_data){
        setStoreShopData(stored_data);
    }
  },[readLocalCache]);

  const validateFacebookSocialLink = (link) => {
    //-.Regular expressions for validating social media links
    const facebookRegex = /^(https?:\/\/)?(www\.)?facebook.com\/.*/i;
    //-.const twitterRegex = /^(https?:\/\/)?(www\.)?twitter.com\/.*/i;

    if(link){
        setIsFacebookUrlValid(
            facebookRegex.test(link)
        );
    }else{
        setIsFacebookUrlValid(
            true
        );
    }
  };

  const validateInstagramSocialLink = (link) => {
    //-.Regular expressions for validating social media links
    //-.const twitterRegex = /^(https?:\/\/)?(www\.)?twitter.com\/.*/i;
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram.com\/.*/i;

    if(link){
        setIsInstagramUrlValid(
            instagramRegex.test(link)
        );
    }else{
        setIsInstagramUrlValid(
            true
        );        
    }
  };

  const handleFacebookChange = (event) => {
    const linkValue = event.target.value;
    setFacebookSocialLink(linkValue);
    validateFacebookSocialLink(linkValue);
  };

  const handleClick = (value) => {
    setSocial(value);
  };

  const handleInstagramChange = (event) => {
    const linkValue = event.target.value;
    setInstagramSocialLink(linkValue);
    validateInstagramSocialLink(linkValue);
  };

  const onSubmitHandler = (event) => {

    event.preventDefault();

    const formData = {};

    setButtonDisabled(true);

    Loading.standard({
        backgroundColor: 'rgba(0,0,0,0)',
    });

    formData.action = inputUpdate;
    formData.phone = storeProfileData[0]?.msisdn || "";
    formData.email = storeProfileData[0]?.email || "";
    formData.owner_reference_number = storeProfileData[0]?.reference_number|| "";
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
            if(social === "1"){
                formData.website_url = inputWebsiteUrl?.current?.value || "";
            }else if(social === "2"){
                formData.facebook_link = inputFacebookLink?.current?.value || "";
            }else if(social === "3"){
                formData.instagram_url = inputInstagramLink?.current?.value || "";
            }
            formData.database_id = storeShopData[0]?.$databaseId || "";
            formData.table_id = storeShopData[0]?.$collectionId || "";
            formData.record_id = storeShopData[0]?.$id || "";

            if(social === "1"){
                updateShop(formData);
            }else if(social === "2" && isFacebookUrlValid){
                updateShop(formData);
            }else if(social === "3" &&  isInstagramUrlValid){
                updateShop(formData);                
            }else{
                if(facebookSocialLink || instagramSocialLink){
                    Notiflix.Notify.info('Invalid facebook or instagram',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    }); 
                }
                setButtonDisabled(false);
                Loading.remove(1523);
            }
        break;
        default:
        break;
    }
  };

  const createShop = (formData) => {
    fetch(`${API_END_POINT}/api/v1/createNewShop`,{
        method:'POST',
        body: JSON.stringify(formData),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(async(response) => {
        await response.json().then(data => {
            if(data?.success){
                inputShopName.current.value='';
                inputContactPhone.current.value='';
                setStoreShopData(data?.data);
                Notiflix.Notify.info('Update successful',{
                    ID:'SWA',
                    timeout:2950,
                    showOnlyTheLastOne:true                      
                }); 
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
                setStoreShopData(data?.data);
                Notiflix.Notify.info('Update successful',{
                    ID:'SWA',
                    timeout:2950,
                    showOnlyTheLastOne:true                      
                }); 
                storeOnLocalCache(STORE_KEY,data?.data); 
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
                                storeProfileData[0]?.subscription === "basic" ?
                                <div className="content">
                                    {
                                    storeProfileData[0]?.is_profile_completed === 1 ?
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
                            <td><h5><strong></strong></h5></td>
                            <td style={{textAlign:"end"}}>
                                {
                                storeShopData[0]?.name ? 
                                <button className="btn btn-success m-2" onClick={toggleShopHide}><i className=""></i> Edit</button>
                                :
                                <button className="btn btn-success m-2" onClick={toggleShopHide} disabled={storeProfileData[0]?.subscription === "basic" || parseInt(storeProfileData[0]?.is_profile_completed === 0 ) ? true : false} ><i className=""></i> Add</button>
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
                            <td colSpan={2} style={{display: storeProfileData[0]?.subscription === "advance" ? "" : "none"}}>
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
                                                        defaultValue={storeShopData[0]?.phone_number ? storeShopData[0]?.phone_number : storeProfileData[0]?.msisdn }
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
                        <tr style={{width:"100%",display: storeShopData[0]?.name && storeProfileData[0]?.subscription === "advance" ? "" : "none"}} >
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
                                                            <td style={{textAlign:"left"}}>Website URL:   {storeShopData[0]?.website_url ?  storeShopData[0]?.website_url : storeProfileData[0]?.website_url }</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{textAlign:"left"}}>Facebook Link: {storeShopData[0]?.facebook_link ?  storeShopData[0]?.facebook_link : storeProfileData[0]?.facebook_link }</td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{textAlign:"left"}}>Instagram Link: {storeShopData[0]?.instagram_url ?  storeShopData[0]?.instagram_url : storeProfileData[0]?.instagram_url }</td>
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
                                                <td width={"91%"}>
                                                    <input
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="WebsiteUrl"
                                                        name="WebsiteUrl"
                                                        defaultValue={storeShopData[0]?.website_url ?  storeShopData[0]?.website_url : storeProfileData[0]?.website_url }
                                                        ref={inputWebsiteUrl}
                                                        placeholder="Website URL"
                                                        maxLength={35}
                                                        required={social === "1" ? true : false}
                                                    />
                                                </td>
                                                <td>
                                                    <button className="my-2 mx-auto btn btn-outline-success" type="submit" onClick={e=>{handleClick('1')}} disabled={buttonDisabled}>
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr><td colSpan={2} height={"18px"}></td></tr> 
                                            <tr>
                                                <td>
                                                    <input 
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="FacebookLink"
                                                        name="FacebookLink"
                                                        defaultValue={storeShopData[0]?.facebook_link ?  storeShopData[0]?.facebook_link : storeProfileData[0]?.facebook_link }
                                                        onChange={handleFacebookChange}
                                                        ref={inputFacebookLink}
                                                        placeholder="Facebook Link"
                                                        maxLength={50}
                                                        required={social === "2" ? true : false}
                                                    />
                                                </td>
                                                <td>
                                                    <button className="my-2 mx-auto btn btn-outline-success" type="submit" onClick={e=>{handleClick('2')}} disabled={buttonDisabled}>
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr><td colSpan={2} height={"18px"}></td></tr> 
                                            <tr>
                                                <td>
                                                    <input 
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="InstagramLink"
                                                        name="InstagramLink"
                                                        defaultValue={storeShopData[0]?.facebook_link ?  storeShopData[0]?.instagram_url : storeProfileData[0]?.instagram_url }
                                                        onChange={handleInstagramChange}
                                                        ref={inputInstagramLink}
                                                        placeholder="Instagram Link"
                                                        maxLength={50}
                                                        required={social === "3" ? true : false}
                                                    />
                                                </td>
                                                <td>
                                                    <button className="my-2 mx-auto btn btn-outline-success" type="submit" onClick={e=>{handleClick('3')}} disabled={buttonDisabled}>
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
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
                                                <td colSpan={2} style={{textAlign:"end"}}>
                                                    <button id="btnCancelLocation" className="my-2 mx-auto btn btn-dark" type="button" onClick={toggleSocialHide}>
                                                        Cancel
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
  )
};

export default CreateShopPage;
