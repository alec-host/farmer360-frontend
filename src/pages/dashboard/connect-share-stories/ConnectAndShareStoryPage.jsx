import React,{ useState, useEffect } from "react";
//import axios from  'axios';
//import Notiflix from "notiflix";
import Avatar from "react-avatar";
//import { Loading } from "notiflix/build/notiflix-loading-aio";

import StoryModalComponent from "./modal/AddStoryModalComponent";
import InfiniteScrollComponent from "./InfiniteScrollComponent";
import { PROFILE_KEY, readLocalCache } from "../../../db/localSessionData";

const ConnectAndShareStoryPage = () => {

    const [storeData,setStoreData] = useState([]);
    //const [storyData,setStoryData] = useState([]);
    //const [buttonDisabled,setButtonDisabled] = useState(false);
    //const [trackDataChange,setTrackDataChange] = useState(false);

    useEffect(() => {
        const stored_data = readLocalCache(PROFILE_KEY);
        if(stored_data){
            setStoreData(stored_data);
            //getStory(stored_data[0]?.reference_number,stored_data[0]?.email);
        }
    },[]);

    console.log(storeData);

    /*
    const getStory = (reference_number,email) => {
        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });
        const config = {
        method: 'GET',
        url: 'http://localhost:8585/api/v1/getStory?owner_reference_number='+reference_number+'&email='+email,
        headers: { 
            "Content-Type": "application/json"
        }};
        
        axios(config).then((resp) => {
            if(resp){
                setStoryData(resp?.data?.data);
                //storeOnLocalCache(STORY_KEY,resp?.data?.data);
            }
            Loading.remove(1523);
        })
        .catch(function (error) {
            Loading.remove(1523);
            console.log(error);
        });
    };

    const handleSubmit = (event) => {
        let formData = {};
        event.preventDefault();

        Loading.standard({
        backgroundColor: 'rgba(0,0,0,0)',
        });

        setButtonDisabled(!buttonDisabled);

        fetch('http://localhost:8585/api/v1/updateUserDetails',{
            method:'PATCH',
            body: JSON.stringify(formData),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(async(response) => {
            await response.json().then(data=>{
                if(data?.success){
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
                },3000);
            });
        })
        .catch(async(error) => {
            console.error(await error);
        });
    };
    */

    //console.log(storyData.length);

    return (
      <>
        <div className="container-fluid" style={{paddingTop:"10px",background:"",height:"750px"}}>
          <div className="container"> 
            <div className="row" >
                    <div className="card">
                        <p></p>
                        <table>
                            <thead><tr><th/></tr></thead>
                            <tbody>
                                <tr>
                                    <td width="50px">
                                        <Avatar 
                                            color="#7E3794"
                                            size={50}
                                            className="me-1"
                                            name={storeData[0]?.first_name !== "" || typeof(storeData[0]?.first_name) !== "undefined" ? storeData[0]?.first_name : ""}
                                            round={true}  
                                        />                                    
                                    </td>
                                    <td>
                                        {<div><StoryModalComponent/></div>}
                                    </td>
                                </tr>
                                <tr><td colSpan={2}></td></tr>
                            </tbody>
                        </table>
                        <p></p>
                    </div>
                    <table>
                        <thead><tr><th/></tr></thead>
                        <tbody>
                            <tr><td><InfiniteScrollComponent/></td></tr>
                        </tbody>
                    </table>
                    <div className="card">
                        <p></p>
                        <p></p>
                        <p></p>
                        <p></p>
                        <div className="content">
                            <hr/>
                            <p><span className="fa-regular fa-thumbs-up me-1"></span>Like<span className="me-5"></span><span className="fa-regular fa-comment me-1"></span>Comment</p>
                        </div>
                    </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default ConnectAndShareStoryPage;