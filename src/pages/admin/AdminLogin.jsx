import React,{ useRef,useState} from "react";
import axios from 'axios';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import {useNavigate } from 'react-router-dom';

import { Footer, Navbar } from "../../components";

import API_END_POINT from "../../endpoint/apiRoute";
import { getSession, setSession } from "../../session/appSession";
import { PROFILE_SESSION } from "../../session/constant";

import buttonStyle from "../../css/custom.button.module.css";

import { COMMENT_KEY, STORY_KEY, INBOX_KEY, storeOnLocalCache, SURVEY_REQUEST_KEY, API_REQUEST_KEY, FARMER_LIMITED_SCOPE_KEY, BUSINESS_LIMITED_SCOPE_KEY, clearLocalCache } from "../../db/localSessionData";

  const AdminLogin = () => {

    const inputUsername = useRef(null);
    const inputPassword = useRef(null);

    const [buttonDisabled, setButtonDisabled] = useState(false);

    const downloadSystemData = (reference_number) => {

      const endpointStories = API_END_POINT+'/api/v1/adminGetAllStories?reference_number='+reference_number;
      const endpointApiRequests = API_END_POINT+'/api/v1/adminGetAllServiceRequests?request_type=api&reference_number='+reference_number;
      const endpointSurveyRequests = API_END_POINT+'/api/v1/adminGetAllServiceRequests?request_type=survey&reference_number='+reference_number;
      const endpointComments = API_END_POINT+'/api/v1/adminGetAllComments?reference_number='+reference_number;
      const endpointInbox = API_END_POINT+'/api/v1/adminGetAllInbox?reference_number='+reference_number;
      const endpointFarmerLimitedScope = API_END_POINT+'/api/v1/adminGetFarmersLimitedScope?reference_number='+reference_number;
      const endpointBusinessLimitedScope = API_END_POINT+'/api/v1/adminGetBusinesslimitedScope?reference_number='+reference_number;
  
      Promise.all([
        axios.get(endpointStories),
        axios.get(endpointApiRequests),
        axios.get(endpointSurveyRequests),
        axios.get(endpointComments),
        axios.get(endpointInbox),
        axios.get(endpointFarmerLimitedScope),
        axios.get(endpointBusinessLimitedScope),
      ])
        .then((responses) => {
          const responseStories = responses[0].data;
          const responseApiRequests = responses[1].data;
          const responseSurveyRequests = responses[2].data;
          const responseComments = responses[3].data;
          const responseInbox = responses[4].data;
          const responseFarmerLimitedScope = responses[5].data;
          const responseBusinessLimitedScope = responses[6].data;

          clearLocalCache(STORY_KEY);
          storeOnLocalCache(STORY_KEY,responseStories?.data);
  
          clearLocalCache(API_REQUEST_KEY);
          storeOnLocalCache(API_REQUEST_KEY,responseApiRequests?.data);
  
          clearLocalCache(SURVEY_REQUEST_KEY);
          storeOnLocalCache(SURVEY_REQUEST_KEY,responseSurveyRequests?.data);
  
          clearLocalCache(COMMENT_KEY);
          storeOnLocalCache(COMMENT_KEY,responseComments?.data);
  
          clearLocalCache(INBOX_KEY);
          storeOnLocalCache(INBOX_KEY,responseInbox?.data);
  
          clearLocalCache(FARMER_LIMITED_SCOPE_KEY);
          storeOnLocalCache(FARMER_LIMITED_SCOPE_KEY,responseFarmerLimitedScope?.data);

          clearLocalCache(BUSINESS_LIMITED_SCOPE_KEY);
          storeOnLocalCache(BUSINESS_LIMITED_SCOPE_KEY,responseBusinessLimitedScope?.data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

    const navigate = useNavigate();

    const onSubmitHandler = async(event) => {
    
    let formData = {};

    event.preventDefault();

    setButtonDisabled(true);

    Loading.standard({
      backgroundColor: 'rgba(0,0,0,0.1)',
    });

    formData.username = inputUsername?.current?.value || "";
    formData.password = inputPassword?.current?.value || "";

    await fetch(`${API_END_POINT}/api/v1/adminLogin`,{
        method:'POST',
        body: JSON.stringify(formData),
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(async(response) => {
        await response.json().then(data=>{
            if(data.success){
                console.log(data?.data);
                setSession(PROFILE_SESSION,data?.data);
                //storeOnLocalCache(PROFILE_KEY,data?.data);
                downloadSystemData(1);
                inputUsername.current.value='';
                inputPassword.current.value='';
                Notiflix.Notify.success('Login was successful',{
                    ID:'SWA',
                    timeout:2050,
                    showOnlyTheLastOne:true                      
                });
                navigate('/admin/dashboard');
            }else{
                let msg = null;
                msg = data?.message;
                Notiflix.Notify.warning(msg,{
                    ID:'FWA',
                    timeout:2950,
                    showOnlyTheLastOne:true
                });
            }
            setButtonDisabled(false);
            Loading.remove(1523);
        });
    }).catch(async(error) => {
        console.error(await error);
    });
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3" style={{height:"auto"}}>
        <h5 className="text-center">Admin Login</h5>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={onSubmitHandler}>              
              <div className="my-3">
                <label htmlFor="Email display-4">Email address</label>
                <input
                  input="text"
                  className="form-control"
                  id="Username"
                  name="Username"
                  ref={inputUsername}
                  placeholder="name@example.com"
                  maxLength={25}
                  required
                />
              </div>
              <div className="my-3">
                <label htmlFor="Password display-4">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="Password"
                  name="Password"
                  ref={inputPassword}
                  placeholder="Password"
                  minLength={6}
                  maxLength={25}
                  required
                />
              </div>
              <div className="text-right">
                <button className={"my-2 mx-auto fw-bold btn "+ buttonStyle.custom_theme_button} type="submit" disabled={buttonDisabled}>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
