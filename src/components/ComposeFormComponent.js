import React, { useState,useEffect } from 'react';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import styles from '../css/modal.module.css';
import formattedDateTime from "../utility/format-current-date";
import API_END_POINT from '../endpoint/apiRoute';

import customCss from "../css/custom.loading.module.css";
import { getSession } from '../session/appSession';
import { PROFILE_SESSION } from '../session/constant';
import { FARMER_LIMITED_SCOPE_KEY, INBOX_KEY, clearLocalCache, readLocalCache, storeOnLocalCache } from '../db/localSessionData';
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'

const ComposeFormComponent = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [storeData, setStoreData] = useState([]);
    const [storeLimitedFarmerData, setStoreLimitedFarmerData] = useState([]);
    const [subject, setSubject] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data) {
            setStoreData(stored_data);
        }
        Loading.init({className:customCss.notiflix_loading,});
    },[]);

    useEffect(() => {
        const stored_data = readLocalCache(FARMER_LIMITED_SCOPE_KEY);
        if(stored_data) {
            setStoreLimitedFarmerData(stored_data);
        }
    },[]);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const handleMessageChange = (e) => {
        const { name, value } = e.target;
        setSubject(value);
    };

    const handleSubjectChange = (e) => {
        const { name, value } = e.target;
        setMessage(value);
    };

    const handleSelectChange = (value) => {
        setSelectedValue(value);
    };

    const handleSubmit = (e) => {
        
        e.preventDefault();

        let formData = {};

        formData.action = "admin";
        formData.subject = subject;
        formData.body = message;
        formData.recipient_uuid = selectedValue;
        formData.date_created = formattedDateTime;
        
        httpPost(formData);
        
        closeModal();
    };

    const httpPost = (formData) => {

        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });

        setButtonDisabled(!buttonDisabled);

        fetch(`${API_END_POINT}/api/v1/createNewInbox`,{
            method:'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'},
        })
        .then(async(response) => {
            await response.json().then(response=>{
                if(response?.success){
                    setSubject(null);
                    setMessage(null);
                    setSelectedValue(null);
                    clearLocalCache(INBOX_KEY);
                    storeOnLocalCache(INBOX_KEY,response?.data);
                    Notiflix.Notify.info('Message successfully posted',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);                
                }else{
                    Notiflix.Notify.warning('Failed to send the message',{
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

  return (
    <div>
      <div className="row">
            <div className="col mx-auto">
                <button className="btn btn-outline-dark btn-sm px-3" onClick={openModal}><i className="fas fa-pencil-alt mx-1"></i>Compose message</button>
            </div>
      </div> 
      {isOpen && (
        <div className="container-fluid">
            <div className="container">
                <div className="row">
                    <div className={styles.modal_overlay}>
                        <div className={styles.modal}>
                            <div className="content text-end">
                                <span className={"fs-2 fw-bold "+styles.close} onClick={closeModal}>&times;</span>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <SelectSearch
                                    id="Search"
                                    name="Search"
                                    options={storeLimitedFarmerData}
                                    search={true}
                                    placeholder="Search a farmer..."
                                    onChange={handleSelectChange}
                                    required        
                                />
                                <hr/>
                                <input
                                    className="form-control"
                                    type="text"
                                    name="Subject"
                                    onChange={handleSubjectChange}
                                    placeholder="Subject..."
                                    required
                                />
                                <hr/>                              
                                <textarea
                                    className="form-control"
                                    name="Message"
                                    style={{fontSize:"18px",color:"#000"}}
                                    rows={4}
                                    onChange={handleMessageChange}
                                    placeholder="Message..."
                                    required
                                />
                                <div>
                                    <button className="mt-2 btn btn-primary px-3">Send</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ComposeFormComponent;
