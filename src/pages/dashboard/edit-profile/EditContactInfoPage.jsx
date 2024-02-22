import React,{ useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import countryList from "../../../db/countryList";
import API_END_POINT from "../../../endpoint/apiRoute";

import { getSession, setSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";

import customCss from "../../../css/custom.loading.module.css";


const EditContactInfoPage = () => {

  const inputFirstName = React.useRef('');
  const inputLastName = React.useRef('');  
  const inputCity = React.useRef('');
  const inputCountry = React.useRef('');

  const [hideProfile, setHideProfile] = useState(false);
  const [hideLocation, setHideLocation] = useState(false);
  const [storeProfileData, setStoreProfileData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [inputUpdate,setInputUpdate] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');

  const toggleProfileHide = () => {
    setHideProfile(!hideProfile);
    setInputUpdate("contact");
    if(!hideLocation ){
        setHideLocation(!hideLocation);
    }
    setHideLocation(hideLocation);
  };

  const toggleLocationHide = () => {
    setHideLocation(!hideLocation);
    setInputUpdate("location");
  };

  useEffect(() => {
    const stored_data = getSession(PROFILE_SESSION);
    if(stored_data){
      setStoreProfileData(stored_data);
    }
  },[]); 

  useEffect(() => {
    setCountry(countryList);
    Loading.init({className:customCss.notiflix_loading,});
  });

  const handleInputContactFocus = (edit_section) => {
    setInputUpdate(edit_section);
  };

  const onSubmitHandler = (event) => {

    let formData = {};

    event.preventDefault();

    setButtonDisabled(true);

    Loading.standard({
        backgroundColor: 'rgba(0,0,0,0)',
    });

    formData.phone = storeProfileData[0]?.msisdn || "";
    formData.email = storeProfileData[0]?.email || "";
    formData.account_type = storeProfileData[0]?.account_type || "";

    switch(inputUpdate){
        case "contact":
            formData.action = "contact";
            formData.first_name = inputFirstName?.current?.value || "";
            formData.last_name = inputLastName?.current?.value || "";
        break;
        case "location":
            formData.action = "location";
            formData.city = region || "";
            formData.country = country || "";
        break;
        default:break;
    }

    formData.database_id = storeProfileData[0]?.$databaseId || "";
    formData.table_id = storeProfileData[0]?.$collectionId || "";
    formData.record_id = storeProfileData[0]?.$id || "";

    fetch(`${API_END_POINT}/api/v1/changeUserProfile`,{
        method:'PATCH',
        body: JSON.stringify(formData),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(async(response) => {
        await response.json().then(data=>{
            if(data?.success){
                inputFirstName.current.value='';
                inputLastName.current.value='';
                setCountry('');
                setRegion('');
                setStoreProfileData(data?.data);
                setSession(PROFILE_SESSION,data?.data);
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

  return storeProfileData?.length > 0 ? (
    <>
      <div className="container-fluid">
        <div className="container" style={{marginTop:"15px"}}>
          <div className="row">
                <table style={{width:"100%"}}>
                    <thead><tr><th/></tr></thead>
                    <tbody>
                        <tr><td><h5><strong>Basic Information</strong></h5></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr>
                            <td><h6><strong>Contact Info</strong></h6></td>
                            <td style={{textAlign:"end"}}>
                                {
                                storeProfileData[0]?.first_name === "N/A" && storeProfileData[0]?.last_name === "N/A" ?
                                null
                                :
                                <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleProfileHide}><i className=""></i> Edit</NavLink>
                                }
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan={2}>
                                <table style={{width:"100%",display: hideProfile ? "none" : ""}}>
                                    <thead><tr><th/></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>{storeProfileData[0]?.first_name === "N/A" && storeProfileData[0]?.last_name === "N/A" ? storeProfileData[0]?.business_name : storeProfileData[0]?.first_name+" "+storeProfileData[0]?.last_name}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign:"left"}}>{storeProfileData[0]?.email}</td>
                                        </tr> 
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
                                                <label htmlFor="FirstName"><small><strong>Name</strong></small></label>
                                                    <input
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="FirstName"
                                                        name="FirstName"
                                                        onFocus={()=>handleInputContactFocus("contact")}
                                                        defaultValue={storeProfileData[0]?.first_name}
                                                        ref={inputFirstName}
                                                        placeholder={"First Name"}
                                                        maxLength={40}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr><td style={{height:"10px"}}></td></tr> 
                                            <tr>
                                                <td colSpan={2}>
                                                    <input
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="LastName"
                                                        name="LastName"
                                                        onFocus={()=>handleInputContactFocus("contact")}
                                                        defaultValue={storeProfileData[0]?.last_name}
                                                        ref={inputLastName}
                                                        placeholder={"Last Name"}
                                                        maxLength={40}
                                                        required
                                                    />
                                                </td>
                                            </tr> 
                                            <tr><td style={{height:"10px"}}></td></tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <label htmlFor="Email"><small><strong>Email</strong></small></label>
                                                    <input 
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="Email"
                                                        name="Email"
                                                        value={storeProfileData[0]?.email}
                                                        placeholder="Email" 
                                                        maxLength={40}
                                                        readOnly
                                                    />
                                                </td> 
                                            </tr> 
                                            <tr>                         
                                                <td colSpan={2}>
                                                    <label htmlFor="Phone"><small><strong>Phone</strong></small></label>
                                                    <input 
                                                        style={{width:"100%"}}
                                                        type="text" 
                                                        className="form-control"
                                                        id="Phone"
                                                        name="Phone"
                                                        value={storeProfileData[0]?.msisdn}
                                                        placeholder="Phone number"
                                                        maxLength={20}
                                                        readOnly
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
                        <tr><td colSpan={2}><hr/></td></tr>
                        <tr>
                            <td><h6><strong>Location</strong></h6></td>
                            <td style={{textAlign:"end"}}>
                                <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleLocationHide}><i></i> Edit</NavLink>
                            </td>                    
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <table style={{width:"100%",display: hideLocation ? "none" : ""}}>
                                    <thead><tr><th/></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td><strong>{storeProfileData[0]?.city}</strong></td>
                                        </tr>
                                        <tr>
                                            <td style={{textAlign:"left"}}>{storeProfileData[0]?.country}</td>
                                        </tr> 
                                    </tbody> 
                                </table>
                            </td>
                        </tr>                                       
                        <tr>
                            <td colSpan={2}>
                                <form onSubmit={onSubmitHandler}> 
                                    <table style={{width:"100%",display: hideLocation ? "" : "none"}}>
                                        <thead><tr><th/></tr></thead>
                                        <tbody>
                                            <tr>
                                                <td colSpan={2}>
                                                    <CountryDropdown
                                                        id="Country"
                                                        name="Country"
                                                        classes="form-control"
                                                        value={country || ''}
                                                        valueType="full"
                                                        defaultValue={storeProfileData[0]?.city === "Not specified" || storeProfileData[0]?.city === null  ? null : storeProfileData[0]?.city}
                                                        onChange={(val) => setCountry(val)}
                                                        ref={inputCountry}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr><td style={{height:"10px"}}></td></tr>
                                            <tr>    
                                                <td colSpan={2}>     
                                                    <RegionDropdown
                                                        id="City"
                                                        name="City"
                                                        classes="form-control"
                                                        country={country}
                                                        countryValueType="full"
                                                        value={region  || ''}
                                                        onChange={(val) => setRegion(val)}
                                                        ref={inputCity}
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
                                                    <button id="btnCancelLocation" className="my-2 mx-auto btn btn-dark" type="button" onClick={toggleLocationHide}>
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
  ):<></>;
};

export default EditContactInfoPage;
