import React,{ useState, useEffect } from "react";
import Select from "react-select";
import { NavLink } from "react-router-dom";

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { age_options, education_options } from "../../../db/optionsData";
import storeInitialLocalData, {readLocalStoredData } from "../../../db/localSessionData";
import API_END_POINT from "../../../endpoint/apiRoute";

const EditDemographicInfoPage = () => {

  const inputAge = React.useRef(null);
  const inputEducation = React.useRef(null);

  const [selectedAge,setSelectedAge] = useState(0);
  const [selectedEducation,setSelectedEducation] = useState(education_options[0].value);
  const [hideAgeBracket, setHideAgeBracket] = useState(false);
  const [hideLevelOfEducation, setHideLevelOfEducation] = useState(false);
  const [storeData, setStoreData] = useState([]);
  const [inputUpdate,setInputUpdate] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [trackDataChange,setTrackDataChange] = useState(false);

  const toggleAgeBracket = () => {
    setHideAgeBracket(!hideAgeBracket);
  };

  const toggleLevelOfEducation = () => {
    setHideLevelOfEducation(!hideLevelOfEducation);
  };

  useEffect(() =>{
    const store_data = readLocalStoredData();
    if(store_data) {
      setStoreData(store_data);
    }
  },[]);

  const handleAgeChange = item => {
    setSelectedAge(item);
    setInputUpdate("age");
  };

  const handleEducationChange = item => {
    setSelectedEducation(item);
    setInputUpdate("education");
  };

  const onSubmitHandler = (event) => {

    let formData = {};

    event.preventDefault();

    setButtonDisabled(true);

    Loading.standard({
        backgroundColor: 'rgba(0,0,0,0)',
    });
  
    formData.phone = storeData[0]?.msisdn || "";
    formData.email = storeData[0]?.email || "";

    switch(inputUpdate){
        case "age":
            formData.action = "demographic_1";
            formData.age_bracket = inputAge?.current?.value || "";
            break;
        case "education":
            formData.action = "demographic_2";
            formData.education_level = inputEducation?.current?.value || "";
            break;
        default:break;
    } 

    formData.database_id = storeData[0]?.$databaseId || "";
    formData.table_id = storeData[0]?.$collectionId || "";
    formData.record_id = storeData[0]?.$id || "";

    fetch(`${API_END_POINT}/api/v1/changeUserDemographicData`,{
        method:'PATCH',
        body: JSON.stringify(formData),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(async(response) => {
        await response.json().then(data=>{
            if(data?.success){
                inputAge.current.value='';
                inputEducation.current.value='';
                setStoreData(data?.data);
                Notiflix.Notify.info('Update was successful',{
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
    storeInitialLocalData(storeData);
  }
  
  return (
    <>
        <div className="container-fluid">
            <div className="container" style={{marginTop:"15px"}}>
                <table style={{width:"100%"}}>
                    <thead><tr><th/></tr></thead>
                    <tbody>
                        <tr><td><h5><strong>My Demographic Information</strong></h5></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr>
                            <td><h6><strong>&nbsp;&nbsp;Gender</strong></h6></td>
                            <td style={{textAlign:"end",textTransform:"capitalize"}}>{storeData[0]?.gender}&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan={2}><hr /></td>
                        </tr>
                        <tr>
                            <td><h6><strong>&nbsp;&nbsp;Age Bracket</strong></h6></td>
                            <td style={{textAlign:"end",textTransform:"capitalize"}}>{storeData[0]?.age_bracket}&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{textAlign:"end"}}>
                                <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleAgeBracket} ><i className=""></i> Edit</NavLink>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <form onSubmit={onSubmitHandler}>
                                    <table style={{width:"100%",display: hideAgeBracket ? "block" : "none",background:''}}>   
                                        <thead><tr><th/></tr></thead>  
                                        <tbody>                  
                                            <tr>
                                                <td colSpan={2}>
                                                    <label htmlFor="Age"></label>
                                                    <Select 
                                                        name="Age"
                                                        onChange={handleAgeChange}
                                                        options={age_options}
                                                        value={selectedAge}
                                                        isOptionDisabled={(option) => option.disabled}
                                                        required
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input
                                                        type="hidden"
                                                        className="form-control"
                                                        id="Age"
                                                        name="Age"
                                                        ref={inputAge}
                                                        value={selectedAge.value}
                                                        readOnly
                                                    />
                                                </td>
                                            </tr> 
                                            <tr>
                                                <td>
                                                    <input
                                                        type="hidden"
                                                        className="form-control"
                                                        id="Operation"
                                                        name="Operation"
                                                        value={inputUpdate}
                                                        readOnly                               
                                                    />
                                                </td>
                                            </tr>                                          
                                            <tr>
                                                <td style={{textAlign:"end",width:"100%"}}>
                                                    <button id="btnCancelProfile" className="my-2 mx-auto btn btn-dark" type="button" onClick={toggleAgeBracket}>
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
                        <tr>
                            <td colSpan={2}><hr /></td>
                        </tr> 
                        <tr>
                            <td><h6><strong>&nbsp;&nbsp;Level of Education</strong></h6></td>
                            <td style={{textAlign:"end",textTransform:"capitalize"}}>{storeData[0]?.education_level}&nbsp;&nbsp;</td>
                        </tr>
                        <tr>
                            <td colSpan={2} style={{textAlign:"end"}}>
                                <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleLevelOfEducation} ><i className=""></i> Edit</NavLink>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={2}> 
                                <form onSubmit={onSubmitHandler}>
                                    <table style={{width:"100%",display: hideLevelOfEducation ? "block" : "none"}}>
                                        <thead><tr><th/></tr></thead> 
                                        <tbody>              
                                            <tr>
                                                <td colSpan={2}>
                                                    <label htmlFor="Education"><small><strong></strong></small></label>
                                                    <Select 
                                                        name="Education"
                                                        onChange={handleEducationChange}
                                                        options={education_options}
                                                        value={selectedEducation}
                                                        isOptionDisabled={(option) => option.disabled}
                                                        required
                                                    />
                                                </td>
                                            </tr> 
                                            <tr>
                                                <td>
                                                    <input
                                                        type="hidden"
                                                        className="form-control"
                                                        id="Education"
                                                        name="Education"
                                                        ref={inputEducation}
                                                        value={selectedEducation.value}
                                                        readOnly                               
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <input
                                                        type="hidden"
                                                        className="form-control"
                                                        id="Operation"
                                                        name="Operation"
                                                        value={inputUpdate}
                                                        readOnly                               
                                                    />
                                                </td>
                                            </tr>                                        
                                            <tr>
                                                <td style={{textAlign:"end",width:"100%"}}>
                                                    <button id="btnCancelProfile" className="my-2 mx-auto btn btn-dark" type="button" onClick={toggleLevelOfEducation}>
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
                        <tr>
                            <td colSpan={2}><hr /></td>
                        </tr>
                        <tr>
                            <td colSpan={2}></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </>
  );
};

export default EditDemographicInfoPage;
