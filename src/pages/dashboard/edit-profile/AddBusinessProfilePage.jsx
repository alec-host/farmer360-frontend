import React,{ useState, useEffect, useRef } from "react";
import Notiflix from "notiflix";
import MultiSelect from "react-awesome-multiselect";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import CustomStepper from "../../../components/CustomStepper";

import API_END_POINT from "../../../endpoint/apiRoute";
import { DBASE_KEY, PROFILE_KEY, clearLocalCache, readLocalCache, storeOnLocalCache } from "../../../db/localSessionData";
import { farm_item_options } from "../../../db/optionsData";


const AddBusinessProfilePage = () => {

  const inputFarmItemList = useRef(null);

  const inputPIN = useRef(null);
  const inputIDNumber = useRef(null);
  const inputBusinessAddress = useRef(null);

  const [storeData,setStoreData] = useState([]);
  const [ activeStep, setActiveStep ] = useState(0);
  const [selectedFarmOption,setSelectedFarmOption] = useState([]);
  const [selectedFarmDisplayOption,setSelectedFarmDisplayOption] = useState([]);
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
    };

    console.log(value);
    /*
    console.log((JSON.stringify({
      [name]: value
    })));*/
  };

  



  let isButtonDisabled = null;

  const handleSelectCb = (opt) => {
    setSelectedFarmOption(opt);
  };

  const handleSelectDispayNameCb = (opt) => {
    setSelectedFarmDisplayOption(opt);
  };

  useEffect(() => {
    const stored_data = readLocalCache(PROFILE_KEY);
    if(stored_data){
      setStoreData(stored_data);
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
    }
  };

  if(activeStep === 0){
    isButtonDisabled = !selectedIDNumberFile;
  }else if(activeStep === 1){
    const idValue = readLocalCache(DBASE_KEY+"id");
    const pinValue = readLocalCache(DBASE_KEY+"pin");
    isButtonDisabled = !selectedBusinessCertFile;
  }else{
    console.log(activeStep);
    if(!selectedFarmOption.length){
      isButtonDisabled = true;
    }else{
      isButtonDisabled = false;
    }   
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData;


    Loading.standard({
      backgroundColor: 'rgba(0,0,0,0)',
    });

    setButtonDisabled(!buttonDisabled);

    /*
    formData.action = "profile";
    formData.phone = storeData[0]?.msisdn || "";
    formData.email = storeData[0]?.email || "";
    formData.gender = selectedGender.value || "";
    formData.age_bracket = selectedAge.value || "";
    formData.education_level = selectedEducation.value || "";
    formData.farmed_items = inputFarmItemList?.current?.value || "";
    formData.database_id = storeData[0]?.$databaseId || "";
    formData.table_id = storeData[0]?.$collectionId || "";
    formData.record_id = storeData[0]?.$id || "";
    formData.is_profile_completed = 1; 

    */

    fetch(`${API_END_POINT}/api/v1/updateUserDetailsFile`,{
        method:'PATCH',
        body: formData
    })
    .then(async(response) => {
        await response.json().then(data=>{
            if(data?.success){
                inputFarmItemList.current.value='';
                setStoreData(data?.data);
                Notiflix.Notify.info('Update was successful',{
                    ID:'SWA',
                    timeout:2950,
                    showOnlyTheLastOne:true                      
                });
                setTrackDataChange(!trackDataChange);
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
            }, 3000);
        });
    })
    .catch(async(error) => {
        console.error(await error);
    });
  };

  const BusinessFormOne = () => { 
    return(
    <>
    <form>          
        <div className="form my-3">
            <label htmlFor="IDNumber"><small><strong>ID Number</strong> for one of the Director/Partner/Business Associate.</small></label> 
            <input
                type="text"
                className="form-control"
                id="IDNumber"
                name="IDNumber"
                defaultValue={activeStep === 0 && typeof(readLocalCache(DBASE_KEY+"id")?.IDNumber) !== "undefined"? readLocalCache(DBASE_KEY+"id").IDNumber : '' } 
                onChange={handleInputChangeOnBusinessForm}
                ref={inputIDNumber}
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
                defaultValue={activeStep === 0 && typeof(readLocalCache(DBASE_KEY+"pin")?.PIN) !== "undefined" ? readLocalCache(DBASE_KEY+"pin").PIN : ''}
                onChange={handleInputChangeOnBusinessForm}
                ref={inputPIN}
                maxLength={20}
                required
            />
        </div>          
    </form>
    </>
    );
  };

  
  const BusinessFormTwo = () => {
    return(
    <>
    <form>
        <div className="form my-3">
            <label htmlFor="BusinessName">Business Name</label> 
            <input
                type="text"
                className="form-control"
                id="BusinessName"
                name="BusinessName"
                defaultValue={storeData[0]?.business_name}
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
                defaultValue={activeStep === 1 && typeof(readLocalCache(DBASE_KEY+"address")?.BusinessAddress) !== "undefined" ? readLocalCache(DBASE_KEY+"address").BusinessAddress : ''}
                onChange={handleInputChangeOnBusinessForm}
                ref={inputBusinessAddress}
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
    </form>
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
                    list={farm_item_options}
                    handleSelectCb={handleSelectCb}
                    handleSelectDispayNameCb={handleSelectDispayNameCb}
                    selectedOptions={selectedFarmOption}
                    dropDownColor={"#FCFCFC"}
                    chipColor={"#EA4335"}
                    listSelectColor={"#008000"}
                    isCloseOnOutsideClick={true}
                    isTypeToSearch={true}
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
                    value={selectedFarmDisplayOption} 
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


  //const StepperBusinessContainer = () => {
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
  //};

};

export default AddBusinessProfilePage;