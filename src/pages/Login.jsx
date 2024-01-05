import React,{useRef,useState} from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import axios from  'axios';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import {useNavigate } from 'react-router-dom';

import { Footer, Navbar } from "../components";
import { COMMENT_KEY, INBOX_KEY, PRODUCT_KEY, STORE_KEY, storeOnLocalCache } from "../db/localSessionData";
import API_END_POINT from "../endpoint/apiRoute";
import { setSession } from "../session/appSession";
import { PROFILE_SESSION } from "../session/constant";
import { account_type_options } from "../db/optionsData";

const getShop = async(reference_number,email) => {
  const config = {
  method: 'GET',
  url: API_END_POINT+'/api/v1/getShop?owner_reference_number='+reference_number+'&email='+email,
  headers: { 
    'Content-Type': 'application/json'
  }};
  await axios(config).then((resp) => {
    if(resp){
      storeOnLocalCache(STORE_KEY,resp?.data?.data);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
};

const getProduct = async(reference_number,email) => {
  const config = {
  method: 'GET',
  url: API_END_POINT+'/api/v1/getProduct?owner_reference_number='+reference_number+'&email='+email,
  headers: { 
    'Content-Type': 'application/json'
  }};
  await axios(config).then((resp) => {
    if(resp){
      storeOnLocalCache(PRODUCT_KEY,resp?.data?.data);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
};

const getInbox = async(reference_number,email) => {
  const config = {
  method: 'GET',
  url: API_END_POINT+'/api/v1/getInbox?owner_reference_number='+reference_number+'&email='+email,
  headers: { 
    'Content-Type': 'application/json'
  }};
  await axios(config).then((resp) => {
    if(resp){
      storeOnLocalCache(INBOX_KEY,resp?.data?.data);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
};

const getComment = async(reference_number,email) => {
  const config = {
  method: 'GET',
  url: API_END_POINT+'/api/v1/getAllComments?owner_reference_number='+reference_number+'&email='+email,
  headers: { 
    'Content-Type': 'application/json'
  }};
  await axios(config).then((resp) => {
    if(resp){
      storeOnLocalCache(COMMENT_KEY,resp?.data?.data);
    }
  })
  .catch(function (error) {
    console.log(error);
  });
};


const Login = () => {

    const inputUsername = useRef(null);
    const inputPassword = useRef(null);

    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [selectedAccountType,setSelectedAccountType] = useState(account_type_options[0].value);

    const navigate = useNavigate();

    const onSubmitHandler = async(event) => {
    
    let formData = {};

    event.preventDefault();

    setButtonDisabled(true);


    console.log(selectedAccountType);

    Loading.standard({
      backgroundColor: 'rgba(0,0,0,0.1)',
    });

    formData.username = inputUsername?.current?.value || "";
    formData.password = inputPassword?.current?.value || "";
    formData.account_type = selectedAccountType || "";

    await fetch(`${API_END_POINT}/api/v1/farmerLogin`,{
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
                getShop(data?.data[0]?.reference_number,inputUsername?.current.value);
                getProduct(data?.data[0]?.reference_number,inputUsername?.current.value);
                getInbox(data?.data[0]?.reference_number,inputUsername?.current.value);
                getComment(data?.data[0]?.reference_number,inputUsername?.current.value);
                inputUsername.current.value='';
                inputPassword.current.value='';
                Notiflix.Notify.success('Login was successful',{
                    ID:'SWA',
                    timeout:2050,
                    showOnlyTheLastOne:true                      
                });
                navigate('/dashboard');
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

  const handleAccountTypeChange = (e) => {
    setSelectedAccountType(e.value);
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3" style={{height:"80vh"}}>
        <h5 className="text-center">Login</h5>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={onSubmitHandler}>
            <div className="my-3">
                <label htmlFor="Email display-4">Account type</label>
                <Select
                    onChange={handleAccountTypeChange}
                    options={account_type_options}
                    isOptionDisabled={(option) => option.disabled}
                    required
                />
              </div>              
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
              <div className="my-3">
                <p>Don't have an account? <Link to="/account-type" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
              <div className="text-right">
                <button className="my-2 mx-auto btn btn-success" type="submit" disabled={buttonDisabled}>
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

export default Login;
