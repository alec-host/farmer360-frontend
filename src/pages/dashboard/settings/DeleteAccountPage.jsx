import React,{ useState, useEffect } from "react";

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import { deleteSession, getSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";
import API_END_POINT from "../../../endpoint/apiRoute";

import customCss from "../../../css/custom.loading.module.css";

import { COMMENT_KEY, INBOX_KEY, PRODUCT_KEY, STORE_KEY, STORY_KEY, clearLocalCache } from "../../../db/localSessionData";

const DeleteAccountPage = () => {

    const [storeProfileData, setStoreProfileData] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data){
            setStoreProfileData(stored_data);
        }
        Loading.init({className:customCss.notiflix_loading,});
    },[]);

    const handleSubmit = (e) => {

        e.preventDefault();

        let routeAction = "";
        const formData = {};

        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });

        if( storeProfileData[0]?.account_type === "business"){
            formData.phone=storeProfileData[0]?.phone;
            formData.business_uuid = storeProfileData[0]?.business_uuid|| "";
            routeAction = 'deleteBusinessAccount';
        }else{
            formData.phone=storeProfileData[0]?.msisdn;
            formData.reference_number = storeProfileData[0]?.reference_number|| "";
            routeAction = 'deleteUserAccount';
        }
    
        formData.database_id = storeProfileData[0]?.$databaseId || "";
        formData.table_id = storeProfileData[0]?.$collectionId || "";
        formData.record_id = storeProfileData[0]?.$id || "";

        httpPatch(formData,routeAction);
    };

    const httpPatch = (formData,routeAction) => {

        fetch(`${API_END_POINT}/api/v1/${routeAction}`,{
            method:'PATCH',
            body: JSON.stringify(formData),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(async(response) => {
            await response.json().then(data => {
                if(data?.success){
                    Notiflix.Notify.info('Account deletion was successful',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    }); 
                    
                    setTimeout(() => {
                        deleteSession(PROFILE_SESSION);
                        clearLocalCache(COMMENT_KEY);
                        clearLocalCache(STORY_KEY);
                        clearLocalCache(STORE_KEY);
                        clearLocalCache(PRODUCT_KEY);
                        clearLocalCache(INBOX_KEY);
                        window.top.location.href = 'http://localhost:3000/'; 
                    }, 2500);
                }else{
                    Notiflix.Notify.warning('Delete has Failed',{
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
                <div className="container mt-2">
                    <div className="row">
                        <form onSubmit={handleSubmit}>
                            <table style={{width:"100%"}}>
                                <thead><tr><th/></tr></thead>
                                <tbody>
                                <tr><td><h5><strong>Delete Account</strong></h5></td></tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                <tr>
                                    <td></td>
                                    <td style={{textAlign:"end"}}>
                                        <button className="btn btn-outline-danger m-2" disabled={buttonDisabled}><i className="" ></i>  Delete</button>
                                    </td>
                                </tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                </tbody>
                            </table>  
                        </form>        
                    </div>
                </div>
            </div>
        </>
    );
};

export default DeleteAccountPage;