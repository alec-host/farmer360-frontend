import React,{ useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import Notiflix from "notiflix";

import { Loading } from "notiflix/build/notiflix-loading-aio";
import CustomStepper from "../../../components/CustomStepper";

import API_END_POINT from "../../../endpoint/apiRoute";
import { DBASE_KEY, clearLocalCache, readLocalCache, storeOnLocalCache } from "../../../db/localSessionData";
import { farm_item_options } from "../../../db/optionsData";
import { deleteSession, getSession, setSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";
import { MultiSelect } from "react-multi-select-component";


const AddBusinessProfilePage = () => {

  const navigate = useNavigate();

  const inputFarmItemList = useRef(null);

  const [storeProfileData,setStoreProfileData] = useState([]);
  const [ activeStep, setActiveStep ] = useState(0);
  const [selectedFarmOption,setSelectedFarmOption] = useState([]);
  const [buttonDisabled,setButtonDisabled] = useState(false);
  const [trackDataChange,setTrackDataChange] = useState(false);

  const [selectedIDNumberFile, setSelectedIDNumberFile] = useState(null);
  const [selectedBusinessCertFile, setSelectedBusinessCertFile] = useState(null);

  const steps = [
    { label: 'Identity Verification', onClick: () => setActiveStep(0) },
    { label: 'Business Information', onClick: () => setActiveStep(1) },
    { label: 'Select Farm Items', onClick: () => setActiveStep(2) },
  ];

  const handleInputChangeOnBusinessForm = (e) => {
    let input = {};
    const { name, value } = e.target;
    switch(name){
      case "IDNumber":
        clearLocalCache(DBASE_KEY+"id");
        input.IDNumber = value;
        storeOnLocalCache(DBASE_KEY+"id",input);
        break;
      case "PIN":
        clearLocalCache(DBASE_KEY+"pin");
        input.PIN = value;
        storeOnLocalCache(DBASE_KEY+"pin",input);
        isButtonDisabled = false;
        break;
      case "BusinessAddress":
        clearLocalCache(DBASE_KEY+"address");
        input.BusinessAddress = value;
        storeOnLocalCache(DBASE_KEY+"address",input);
        break;
        default:break;
    };
  };

  let isButtonDisabled = null;

  useEffect(() => {
    const stored_data = getSession(PROFILE_SESSION);
    if(stored_data){
      setStoreProfileData(stored_data);
    }
  },[]);
  
  const handleFileChangeOnBusinessForm = (e) => {
    switch(e.target.name){
      case "IDCopy":
        setSelectedIDNumberFile(e.target.files[0]);
        break;
      case "BusinessCertCopy":
        setSelectedBusinessCertFile(e.target.files[0]);
        break;
      default: break;
    }
  };

  if(activeStep === 0){
    isButtonDisabled = !selectedIDNumberFile;
  }else if(activeStep === 1){
    isButtonDisabled = !selectedBusinessCertFile;
  }else{
    if(!selectedFarmOption.length){
      isButtonDisabled = true;
    }else{
      isButtonDisabled = false;
    }   
  }

  const handleSubmit = (event) => {

    event.preventDefault();

    Loading.standard({
      backgroundColor: 'rgba(0,0,0,0)',
    });

    setButtonDisabled(!buttonDisabled);

    const farmOptions = selectedFarmOption.map(item => item.value);

    const formData = new FormData();
    formData.append('action',"business_profile");
    formData.append('pin',typeof(readLocalCache(DBASE_KEY+"pin")?.PIN) !== "undefined" ? readLocalCache(DBASE_KEY+"pin").PIN : '');
    formData.append('id_file',selectedIDNumberFile);
    formData.append('id_number',typeof(readLocalCache(DBASE_KEY+"id")?.IDNumber) !== "undefined"? readLocalCache(DBASE_KEY+"id").IDNumber : '');
    formData.append('business_address',typeof(readLocalCache(DBASE_KEY+"address")?.BusinessAddress) !== "undefined" ? readLocalCache(DBASE_KEY+"address").BusinessAddress : '');
    formData.append('business_cert_file',selectedBusinessCertFile);
    formData.append('farm_item',farmOptions.join(', '));
    formData.append('owner_reference_number',storeProfileData[0]?.reference_number || '')
    formData.append('database_id',storeProfileData[0]?.$databaseId);
    formData.append('record_id',storeProfileData[0]?.$id);
    formData.append('table_id',storeProfileData[0]?.$collectionId);

    fetch(`${API_END_POINT}/api/v1/updateUserDetailsFile`,{
        method:'PATCH',
        body: formData
    })
    .then(async(response) => {
        await response.json().then(data=>{
            console.log(data);
            if(data?.success){
                clearLocalCache(DBASE_KEY+"pin");
                clearLocalCache(DBASE_KEY+"id");
                clearLocalCache(DBASE_KEY+"address");
                setSelectedIDNumberFile(null);
                setSelectedBusinessCertFile(null);
                inputFarmItemList.current.value='';
                deleteSession(PROFILE_SESSION);
                Notiflix.Notify.info('Update was successful',{
                    ID:'SWA',
                    timeout:2950,
                    showOnlyTheLastOne:true                      
                });
                setTrackDataChange(!trackDataChange);
                setSession(PROFILE_SESSION,data?.data);
                setStoreProfileData(getSession(PROFILE_SESSION));
            }else{
                Notiflix.Notify.warning('Update has Failed',{
                    ID:'FWA',
                    timeout:2950,
                    showOnlyTheLastOne:true
                });
            }
            Loading.remove(1523);
            setTimeout(() => {
              setButtonDisabled(buttonDisabled); 
            },3000);
            navigate('/dashboard/default');
        });
    })
    .catch(async(error) => {
        console.error(await error);
    });
  };

  const BusinessFormOne = () => { 
    return(
    <>          
        <div className="form my-3">
            <label htmlFor="IDNumber"><small><strong>ID Number</strong> for one of the Director/Partner/Business Associate.</small></label> 
            <input
                type="text"
                className="form-control"
                id="IDNumber"
                name="IDNumber"
                defaultValue={activeStep === 0 && (readLocalCache(DBASE_KEY+"id")?.IDNumber) ? readLocalCache(DBASE_KEY+"id").IDNumber : '' } 
                onChange={e=>{handleInputChangeOnBusinessForm(e)}}
                maxLength={20}
                required
            />
        </div>
        <div className="form my-3">
            <label htmlFor="IDCopy"><small>Attach a copy of <strong>ID Card</strong> for the <strong>ID Number</strong> provided above.</small></label>
            <input
                type="file"
                className="form-control"
                id="IDCopy"
                name="IDCopy"
                accept=".png, .jpeg, .jpg, .pdf"
                onChange={handleFileChangeOnBusinessForm}
                required
            />
        </div>
        <div className="form my-3">
            <label htmlFor="PIN"><small><strong>PIN Number</strong> for one of the Director/Partner/Business Associate.</small></label>
            <input
                type="text"
                className="form-control"
                id="PIN"
                name="PIN"
                defaultValue={activeStep === 0 && (readLocalCache(DBASE_KEY+"pin")?.PIN) ? readLocalCache(DBASE_KEY+"pin").PIN : ''}
                onChange={handleInputChangeOnBusinessForm}
                maxLength={20}
                required
            />
        </div>          
    </>
    );
  };

  const BusinessFormTwo = () => {
    return(
    <>
        <div className="form my-3">
            <label htmlFor="BusinessName">Business Name</label> 
            <input
                type="text"
                className="form-control"
                id="BusinessName"
                name="BusinessName"
                defaultValue={storeProfileData[0]?.business_name}
                readOnly
            />
        </div>
        <div className="form my-3">
            <label htmlFor="BusinessAddress">Business Address</label> 
            <input
                type="text"
                className="form-control"
                id="BusinessAddress"
                name="BusinessAddress"
                defaultValue={activeStep === 1 && (readLocalCache(DBASE_KEY+"address")?.BusinessAddress) ? readLocalCache(DBASE_KEY+"address").BusinessAddress : ''}
                onChange={handleInputChangeOnBusinessForm}
                maxLength={25}
                required={false}
            />
        </div>
        <div className="form my-3">
            <label htmlFor="BusinessCertCopy"><small>Attach Business Registration Certificate</small></label>
            <input
                type="file"
                className="form-control"
                id="BusinessCertCopy"
                name="BusinessCertCopy"
                accept=".png, .jpeg, .jpg, .pdf"
                onChange={handleFileChangeOnBusinessForm}
                required
            />
        </div>
    </>
    );
  };

  const DemographicFormThree = () => {
    return(
      <>
      <form onSubmit={handleSubmit}>
        <div className="form my-3">
          <table style={{width:'100%'}}>
              <thead><tr><th/></tr></thead>
              <tbody>
              <tr><td align="left"><label htmlFor="FarmList">What do you farm?</label> </td></tr>
              <tr>
                <td>
                  <MultiSelect
                    options={farm_item_options}
                    value={selectedFarmOption}
                    onChange={setSelectedFarmOption}
                    labelledBy="Select Options from list"
                    className="fw-bold text-danger"  
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <input 
                    type="hidden" 
                    id="FarmItem" 
                    name="FarmItem" 
                    style={{width:'100%'}}
                    value={selectedFarmOption} 
                    ref={inputFarmItemList} 
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </table>                   
        </div>  
        <div className="form my-3">
            <table>
                <thead><tr><th/></tr></thead>
                <tbody>
                  <tr>
                      <td style={{width:"100%",height:'150px'}}></td>
                      <td style={{textAlign:"end"}}>
                      <button className="my-2 mx-auto btn btn-success" type="submit" disabled={isButtonDisabled || buttonDisabled}>
                        Submit
                      </button>
                      </td>
                  </tr> 
                </tbody>
            </table>
        </div>                                                                                                       
      </form>
      </>
    );
  };

  const BusinessSectionComponent = () => {
    switch(activeStep){
      case 0: return <BusinessFormOne />;
      case 1: return <BusinessFormTwo />;
      case 2: return <DemographicFormThree />;
      case 3: return null;
      default: return null;
    }
  };

  return (
    <>
      <div className="container-fluid" style={{marginTop:"0px",background:"#F9F9F9",height:"750px"}}>
        <div className="container">
          <div className="row">
            <CustomStepper
                steps={steps}
                activeStep={activeStep} />
            <div className="row my-4 h-100">
              <div className="col-md-4 col-lg-9 col-sm-8 mx-auto">
                <BusinessSectionComponent />
              </div>
            </div>
          </div>
          <div className="row" style={{background:"",textAlign:"right"}}>
            <div className="row my-4 h-100">
              <div className="col-md-4 col-lg-9 col-sm-8 mx-auto">
                <table style={{width:'100%'}}>
                  <thead><tr><th/></tr></thead>
                  <tbody>
                    <tr>
                      { (activeStep !== 0 && activeStep !== steps.length - 1)
                        && <td align='left'><button className="my-2 mx-auto btn btn-success" onClick={ () => setActiveStep(activeStep - 1) }>Back</button></td>
                      }
                      { activeStep !== steps.length - 1
                        && <td><button className="my-2 mx-auto btn btn-success" onClick={ () => setActiveStep(activeStep + 1) } disabled={isButtonDisabled}>Next</button></td>
                      }
                    </tr>
                  </tbody>
                </table>
              </div>  
            </div>  
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBusinessProfilePage;