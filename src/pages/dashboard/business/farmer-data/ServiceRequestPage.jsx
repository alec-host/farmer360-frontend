import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

import Notiflix from "notiflix";
import { Loading } from "notiflix/build/notiflix-loading-aio";

import formattedDateTime from "../../../../utility/format-current-date";
import { PROFILE_SESSION } from "../../../../session/constant";
import { getSession } from "../../../../session/appSession";
import API_END_POINT from "../../../../endpoint/apiRoute";

import customCss from "../../../../css/custom.loading.module.css";

const ServiceRequestPage = () => {

    const inputDescription = useRef(null);
    const inputSurveyObjective = useRef();
    const inputSurveyTitle = useRef(null);
    const inputTargetAudience = useRef(null);
    const inputNumberOfParticipant = useRef(null);

    const menuOption = new URLSearchParams(window?.location?.search).get('service');

    const allowedFileTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];

    const [storeData, setStoreData] = useState([]);
    const [hideApiRequestForm,setHideApiRequestForm] = useState(false);
    const [hideSurveyRequestForm,setHideSurveyRequestForm] = useState(false);
    const [menuSelected,setMenuSelected] = useState(menuOption);
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState('');
    const [buttonDisabled,setButtonDisabled] = useState(false);

    useEffect(() =>{
        const stored_data = getSession(PROFILE_SESSION);
        if (stored_data) {
          setStoreData(stored_data);
        }
        Loading.init({className:customCss.notiflix_loading,});
    },[]);

    const toggleHideRequestForm = (option) => {
        switch(option){
            case "1":
                if(!hideApiRequestForm){
                    setHideApiRequestForm(hideApiRequestForm);
                }
                setHideApiRequestForm(!hideApiRequestForm);
                setMenuSelected(option);
            break;
            case "2":
                if(!hideSurveyRequestForm){
                    setHideSurveyRequestForm(hideSurveyRequestForm);
                }
                setHideSurveyRequestForm(!hideSurveyRequestForm);  
                setMenuSelected(option);              
            break;
            default:break;
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if(file){
            if(allowedFileTypes.includes(file.type)){
                setSelectedFile(file);
                setMessage('File attached successfully.');
            }else{
                setSelectedFile(null);
                setMessage('Invalid file type. Please attach a doc, docx, or pdf file.');
            }
        }else{
            setSelectedFile(null);
            setMessage('No file selected');
        }
    };

    const handleSubmit = (event) => {

        event.preventDefault();

        setButtonDisabled(true);

        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });

        const formData = {};
        if(menuSelected === "1"){
            const url = `${API_END_POINT}/api/v1/createApiRequest`;
            formData.request_type="api";
            formData.description = inputDescription?.current.value;
            formData.business_uuid = storeData[0].business_uuid;
            formData.business_name = storeData[0].business_name;
            formData.date_created = formattedDateTime || "";
            
            httpPost(formData,url);
        }else{

            /*
            const formData = new FormData();
            const url = `${API_END_POINT}/api/v1/createSurveyRequest`;
            formData.append('request_type','survey');
            formData.append('file',selectedFile || null);
            formData.append('business_uuid',storeData[0].business_uuid);
            formData.append('business_name',storeData[0].business_name);
            formData.append('original_file_name',selectedFile.name || null);
            formData.append('date_created',formattedDateTime);
            */

            const url = `${API_END_POINT}/api/v1/createSurveyRequest`;
            formData.request_type = "survey";
            formData.survey_objective = inputSurveyObjective?.current.value;
            formData.survey_title = inputSurveyTitle?.current.value;
            formData.target_audience = inputTargetAudience?.current.value;
            formData.number_of_participants = inputNumberOfParticipant?.current.value;
            formData.business_uuid = storeData[0].business_uuid;
            formData.business_name = storeData[0].business_name;
            formData.date_created = formattedDateTime || "";

            httpPost(formData,url);
        }
    };

    const httpPost = (formData,endPoint) => {
        fetch(endPoint,{
            method:'POST',
            body: menuSelected && menuSelected === "1" ? JSON.stringify(formData) : JSON.stringify(formData),
            headers: menuSelected && menuSelected === "1" ? {'Content-Type': 'application/json'} : {'Content-Type': 'application/json'}
        })
        .then(async(response) => {
            await response.json().then(data=>{
                if(data?.success){
                    setMessage(null);
                    setSelectedFile(null);
                    inputDescription.value='';
                    inputSurveyObjective.value='';
                    inputSurveyTitle.value='';
                    inputTargetAudience.value='';
                    inputNumberOfParticipant.value='';
                    Notiflix.Notify.info('Update was successful',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    });
                    //setTrackDataChange(!trackDataChange);
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
                },2000);
            });
        })
        .catch(async(error) => {
            console.error(await error);
        });
    };        

    const ApiRequestForm = () => {
        return (
            <>
            <form onSubmit={handleSubmit}>
                <table style={{width:"100%"}}>
                    <thead><tr><th/></tr></thead>
                    <tbody>
                        <tr><td><h5><strong>API Integration</strong></h5></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr>
                            <td colSpan={2}>
                                <small style={{fontSize:'.75em'}}><i style={{color:'red'}}>* </i>Additional cost to be incurred.</small>
                            </td>
                        </tr>                          
                        <tr>
                            <td></td>
                            <td style={{textAlign:"end"}}>
                                <NavLink to="#" className="btn btn-outline-success m-2" onClick={e=>{toggleHideRequestForm(menuSelected)}}>Make Request</NavLink>
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan={2}>
                                <table style={{width:"100%",display: hideApiRequestForm ? "" : "none"}}>
                                    <thead><tr><th/></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td><strong></strong></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <hr/>
                                                <div className="mb-3">
                                                    <label htmlFor="Description"><small><strong>Description</strong></small></label>
                                                    <textarea 
                                                        className="form-control" 
                                                        type="text"
                                                        id="Description"
                                                        name="Description"
                                                        ref={inputDescription}
                                                        rows={5}
                                                        placeholder="Provide a short description of what you need" 
                                                        required
                                                    />
                                                </div>
                                                <div style={{textAlign:'right'}}>
                                                    <button className="btn btn-dark">Submit</button>
                                                </div>
                                            </td>
                                        </tr> 
                                    </tbody> 
                                </table>
                            </td>
                        </tr>
                    </tbody> 
                </table> 
            </form>            
            </>
        );
    };

    const SurveyRequestForm = () => {
        return (
            <>
            <form onSubmit={handleSubmit}>
                <table style={{width:"100%"}}>
                    <thead><tr><th/></tr></thead>
                    <tbody>
                        <tr><td><h5><strong>Survey Request</strong></h5></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr>
                            <td colSpan={2}>
                                <small style={{fontSize:'.75em'}}><i style={{color:'red'}}>* </i>Free survey request/year limited to <strong>200</strong> farmers: Additional cost.</small>
                            </td>
                        </tr>                        
                        <tr>
                            <td></td>
                            <td style={{textAlign:"end"}}>
                                <NavLink to="#" className="btn btn-outline-success m-2" onClick={e=>{toggleHideRequestForm(menuSelected)}}>Make Request</NavLink>
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan={2}>
                                <table style={{width:"100%",display: hideSurveyRequestForm ? "" : "none"}}>
                                    <thead><tr><th/></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td><strong></strong></td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <hr/>                                                
                                                <div className="mb-3">
                                                    <label htmlFor="SurveyTemplate"><small><strong>Objective & Purpose of the Survey</strong></small></label>
                                                    <textarea
                                                        className="form-control"
                                                        id="SurveyObjectivePurpose"
                                                        name="SurveyObjectivePurpose"
                                                        ref={inputSurveyObjective}
                                                        rows={3}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="SurveyTitle"><small><strong>Survey Title</strong></small></label>
                                                    <input type="text" 
                                                        className="form-control" 
                                                        id="SurveyTitle" 
                                                        name="SurveyTitle"
                                                        ref={inputSurveyTitle}
                                                        maxLength={60}
                                                        required
                                                    />
                                                </div>                                                 
                                                <div className="mb-3">
                                                    <label htmlFor="TargetAudience"><small><strong>Target Audience</strong></small></label>
                                                    <textarea
                                                        className="form-control"
                                                        id="TargetAudience"
                                                        name="TargetAudience"
                                                        ref={inputTargetAudience}
                                                        rows={3}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="NumberOfParticipants"><small><strong>Number of Participants</strong></small></label>
                                                    <input type="number" 
                                                        className="form-control" 
                                                        id="NumberOfParticipants" 
                                                        name="NumberOfParticipants"
                                                        ref={inputNumberOfParticipant}
                                                        maxLength={4}
                                                        required
                                                    />
                                                </div> 
                                                <div className="mb-3">

                                                </div>
                                                <div className="mb-3">

                                                </div>
                                                {
                                                    <div className="mb-3" style={{display:"none"}}>
                                                        {/*
                                                        <label htmlFor="SurveyTemplate"><small><strong>Attache File</strong> (Survey template)</small></label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            id="SurveyTemplate"
                                                            name="SurveyTemplate"
                                                            accept=".doc, .docx, .pdf"
                                                            onChange={handleFileChange}
                                                            required = {!selectedFile ? true:false}
                                                        />
                                                        */}
                                                        <p></p>
                                                        <p><small style={{color:'red'}}>{message}</small></p>
                                                    </div>
                                                }
                                                <div style={{textAlign:'right'}}>
                                                    <button className="btn btn-dark">Submit</button>
                                                </div>
                                            </td>
                                        </tr> 
                                    </tbody> 
                                </table>
                            </td>
                        </tr>
                    </tbody> 
                </table>
            </form>           
            </>
        );
    };

    return (
        <>
            <div className="d-flex align-items-center justify-content-center pb-5">
                <div className="col-md-10" style={{marginTop:"15px"}}>
                    {
                        menuSelected && menuSelected !== "2" ?
                        <ApiRequestForm/>
                        :
                        <SurveyRequestForm/>
                    }
                </div>
            </div>
        </>
    );
};

export default ServiceRequestPage;
