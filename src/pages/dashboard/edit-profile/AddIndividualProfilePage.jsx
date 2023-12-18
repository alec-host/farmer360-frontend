import React,{ useState, useEffect, useRef } from "react";
import Notiflix from "notiflix";
import Select from "react-select";
import MultiSelect from "react-awesome-multiselect";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import CustomStepper from "../../../components/CustomStepper";

import Profile from "../ProfilePage";
import API_END_POINT from "../../../endpoint/apiRoute";
import { PROFILE_KEY, readLocalCache, storeOnLocalCache } from "../../../db/localSessionData";
import { age_options, education_options, farm_item_options, gender_options } from "../../../db/optionsData";
import AddBusinessProfilePage from "./AddBusinessProfilePage";

const AddIndividualProfilePage = () => {

  const inputGender = useRef(null);
  const inputAge = useRef(null); 
  const inputEducation = useRef(null);
  const inputFarmItemList = useRef(null);
  
  const [selectedGender,setSelectedGender] = useState(gender_options[0].value);
  const [selectedAge,setSelectedAge] = useState(0);
  const [selectedEducation,setSelectedEducation] = useState(education_options[0].value);
  const [storeData,setStoreData] = useState([]);
  const [ activeStep, setActiveStep ] = useState(0);
  const [selectedFarmOption,setSelectedFarmOption] = useState([]);
  const [selectedFarmDisplayOption,setSelectedFarmDisplayOption] = useState([]);
  const [buttonDisabled,setButtonDisabled] = useState(false);
  const [trackDataChange,setTrackDataChange] = useState(false);

  const steps = [
    { label: 'Add Gender & Age', onClick: () => setActiveStep(0) },
    { label: 'Add Education', onClick: () => setActiveStep(1) },
    { label: 'Select Farm Items', onClick: () => setActiveStep(2) },
  ];

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
  
  const handleGenderChange = item => {
    setSelectedGender(item);
  };

  const handleAgeChange = item => {
    setSelectedAge(item);
  };

  const handleEducationChange = item => {
    setSelectedEducation(item);
  };

  if(activeStep === 0){
    isButtonDisabled = !selectedGender || !selectedAge;
  }else if(activeStep === 1){
    isButtonDisabled = !selectedEducation;
  }else{
    if(!selectedFarmOption.length){
      isButtonDisabled = true;
    }else{
      isButtonDisabled = false;
    }
  }

  const handleSubmit = (event) => {
    let formData = {};
    event.preventDefault();

    Loading.standard({
      backgroundColor: 'rgba(0,0,0,0)',
    });

    setButtonDisabled(!buttonDisabled);

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

    fetch(`${API_END_POINT}/api/v1/updateUserDetails`,{
        method:'PATCH',
        body: JSON.stringify(formData),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(async(response) => {
        await response.json().then(data=>{
            if(data?.success){
                setSelectedGender('');
                setSelectedAge(0);
                setSelectedEducation('');
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

  const DemographicFormOne = () => {
    return(
      <>
      <form>
        <div className="form my-3">
            <label htmlFor="Gender">Gender</label> 
            <Select
                name="Gender"
                onChange={handleGenderChange}
                options={gender_options}
                value={selectedGender}
                isOptionDisabled={(option) => option.disabled}
                required
            />
        </div>
        <div className="form my-3">
            <input
                type="hidden"
                className="form-control"
                id="Gender"
                name="Gender"
                ref={inputGender}
                value={selectedGender.value}
                readOnly
            />
        </div>                           
        <div className="form my-3">
            <label htmlFor="Age">Age bracket</label> 
            <Select 
                name="Age"
                onChange={handleAgeChange}
                options={age_options}
                value={selectedAge}
                isOptionDisabled={(option) => option.disabled}
                required
            />
        </div>
        <div className="form my-3">
            <input
                type="hidden"
                className="form-control"
                id="Age"
                name="Age"
                ref={inputAge}
                value={selectedAge.value}
                readOnly
            />
        </div>
      </form>
      </>
    );
  };

  const DemographicFormTwo = () => {
    return(
      <>
      <form>
        <div className="form my-3">
            <label htmlFor="Name">Level of education</label> 
            <Select 
                onChange={handleEducationChange}
                options={education_options}
                value={selectedEducation}
                isOptionDisabled={(option) => option.disabled}
                required
            />
        </div>
        <div className="form my-3">
            <input
                type="hidden"
                className="form-control"
                id="Education"
                name="Education"
                ref={inputEducation}
                value={selectedEducation.value}
                readOnly                               
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
              <tr><td align="left"><label for="FarmList">What do you farm?</label> </td></tr>
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

  const IndividualSectionComponent = () => {
    switch(activeStep){
      case 0: return <DemographicFormOne />;
      case 1: return <DemographicFormTwo />;
      case 2: return <DemographicFormThree />;
      case 3: return null;
      default: return null;
    }
  };

  const StepperIndiviualContainer = () => {
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
                  <IndividualSectionComponent />
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

  if(trackDataChange === true){
    storeOnLocalCache(PROFILE_KEY,storeData);
  }
  if(storeData[0]?.is_profile_completed === 0 && storeData[0]?.entity_type === "individual"){
    return <StepperIndiviualContainer />;
  }else if(storeData[0]?.is_profile_completed === 0 && storeData[0]?.entity_type === "business"){
    return <AddBusinessProfilePage />;
  }else{
    return <Profile />;
  }

};

export default AddIndividualProfilePage;