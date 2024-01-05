import React, { useState,useEffect } from 'react';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import  styles from '../../../../css/modal.module.css';
import formattedDateTime from "../../../../utility/format-current-date";
import { PROFILE_KEY, readLocalCache } from '../../../../db/localSessionData';
import API_END_POINT from '../../../../endpoint/apiRoute';

import customCss from "../../../../css/custom.loading.module.css";

const StoryModalComponent = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [storeData, setStoreData] = useState([]);
    const [story, setStory] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [error, setError] = useState(null);
 
    const handleFileChange = (event) => {
        const file = event.target.files[0];
    
        if (file && !['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
          setError('Invalid file type. Please select a PNG or JPEG image.');
          return;
        }
    
        if (file && file.size > 2 * 1024 * 1024) {
          setError('File size exceeds the maximum limit (2MB). Please choose a smaller file.');
          return;
        }
    
        setError(null);

        setSelectedFile(file);
    };

    useEffect(() => {
        const stored_data = readLocalCache(PROFILE_KEY);
        if(stored_data) {
            setStoreData(stored_data);
        }
        Loading.init({className:customCss.notiflix_loading,});
    },[]);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setError(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStory(value);
    };

    const handleSubmit = (e) => {
        
        e.preventDefault();
        if(selectedFile !== null){
            const formData = new FormData();
            formData.append('posted_story',story);
            formData.append('owner_reference_number', storeData[0].reference_number || "");
            formData.append('full_name', storeData[0].first_name +" "+ storeData[0].last_name || "");
            formData.append('file', selectedFile);
            formData.append('original_file_name', selectedFile?.name || null);
            formData.append('date_created', formattedDateTime);
            formData.append('action','file');
            console.log('Form submitted with data:', formData);

            httpPost(formData,'createStoryFile');
        }else{
            let formData = {};
            formData.posted_story = story;
            formData.owner_reference_number = storeData[0].reference_number || "";
            formData.full_name = storeData[0].first_name +" "+ storeData[0].last_name || "";
            formData.date_created = formattedDateTime;
            formData.action = 'nofile';
            console.log( JSON.stringify(formData));  
            
            httpPost(JSON.stringify(formData),'createStoryText');
        }

        closeModal();
    };

    const httpPost = (formData,routeAction) => {

        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });

        setButtonDisabled(!buttonDisabled);

        const contentType = routeAction === "createStoryFile" ? {} : {'Content-Type': 'application/json'};

        fetch(`${API_END_POINT}/api/v1/${routeAction}`,{
            method:'POST',
            body: formData,
            headers: contentType,
        })
        .then(async(response) => {
            await response.json().then(data=>{
                console.log(data);
                if(data?.success){
                    setStory(null);
                    setSelectedFile(null);
                    Notiflix.Notify.info('Story posted',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);                
                }else{
                    Notiflix.Notify.warning('Failed to the story',{
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
      <button className={styles.button_like_input} onClick={openModal}>Start a story</button>
      {isOpen && (
        <div className="container-fluid">
            <div className="container">
                <div className="row">
                    <div className={styles.modal_overlay}>
                        <div className={styles.modal}>
                            <div className="content" style={{textAlign:"end",paddingBottom:"10px"}}>
                                <span className={styles.close} onClick={closeModal}><strong>&times;</strong></span>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    className="form-control"
                                    name="story"
                                    style={{fontSize:"18px",color:"#000"}}
                                    rows={6}
                                    onChange={handleInputChange}
                                    placeholder="What is your story today?"
                                    required
                                />
                                <label htmlFor="imag_path"><small><strong>*</strong>Image file is optional, & should not exceed <strong>2MB</strong></small></label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="MediaFile"
                                    accept=".png, .jpeg, .jpg"
                                    onChange={handleFileChange}
                                />
                                 {error && <p style={{color:"red",fontSize:"11px",marginTop:"2px",marginBottom:"2px"}}>{error}</p>}
                                <div className="content" style={{textAlign:"end"}}>
                                    <button className="my-2 mx-auto btn btn-primary" type="submit">Post</button>
                                </div>
                            </form>
                            <hr/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default StoryModalComponent;
