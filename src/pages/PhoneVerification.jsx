import React, { useEffect, useState } from "react";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import PhoneInput from "react-phone-input-2";
import { auth } from "../firebase/firebase";
import { Footer, Navbar } from "../components";

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import buttonStyle from "../css/custom.button.module.css";
import { Link, useNavigate } from "react-router-dom";
import API_END_POINT from "../endpoint/apiRoute";

const PhoneVerification = () => {

    const [phone, setPhone] = useState('+254');
    const [inputPhone, setInputPhone] = useState('+254');
    const [hasFilled, setHasFilled] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOtpRequestLink,setShowOtpRequestLink] = useState(false);
    const [hideRequestOtpButton,setHideRequestOtpButton] = useState(true);

    const entity = new URLSearchParams(window?.location?.search).get('entity');
    const in_phone = new URLSearchParams(window?.location?.search).get('phone');

    useEffect(() => {
      if(in_phone){
        setInputPhone('+'+in_phone);
      }
    },[]);

    console.log(in_phone);
    
    const generateRecaptcha = () => {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha', {
        size: 'invisible',
        callback: () => {
            console.log('recaptcha resolved..')
        }
      });
    } 

    const handleSubmit = (event) => {

      event.preventDefault();

      if(inputPhone === phone){
        setHasFilled(true);
        generateRecaptcha();
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, phone, appVerifier)
          .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
          }).catch((error) => {
            // Error; SMS not sent
            setShowOtpRequestLink(!showOtpRequestLink);
            console.log(error);
          });
      }else{
        Notiflix.Notify.warning('Invalid Phone Number.',{
          ID:'SWAL',
          timeout:2950,
          showOnlyTheLastOne:true                      
        });
      }
    }
    
    const navigate = useNavigate();

    const verifyOtp = (event) => {
      let otp = event.target.value;
      
      setOtp(otp);
  
      if (otp.length === 6) {
        console.log(otp);
        // verify otp
        let confirmationResult = window.confirmationResult;
        confirmationResult.confirm(otp).then((result) => {

          let user = result.user;

          console.log(otp);

          /*
          let formData = {};
          let user = result.user;

          formData.is_verified = 1;
          formData.phone = user.phone.phoneNumber;
          formData.is_verified = entity;

          console.log(formData);
          */
          
          //httpPost(formData);
          navigate('/login/1');
          
        }).catch((error) => {
          Notiflix.Notify.warning('User couldn\'t sign in (bad verification code?',{
            ID:'SWAL',
            timeout:2950,
            showOnlyTheLastOne:true                      
          });
        });
      }
    }

    const httpPost = (formData) => {
      fetch(`${API_END_POINT}/api/v1/verifyPhoneNumber`,{
          method:'PATCH',
          body: JSON.stringify(formData),
          headers:{
              'Content-Type': 'application/json'
          }
      })
      .then(async(response) => {
          await response.json().then(data=>{
              if(data?.success){
                  Notiflix.Notify.info('Verification was successful',{
                      ID:'SWA',
                      timeout:2950,
                      showOnlyTheLastOne:true                      
                  });
                  navigate('/login/1');
              }else{
                  Notiflix.Notify.warning('Verification has Failed',{
                      ID:'FWA',
                      timeout:2950,
                      showOnlyTheLastOne:true
                  });
              }
              Loading.remove(1523);
          });
      })
      .catch(async(error) => {
          console.error(await error);
      });
    };

    const handleButtonShow = () => {
      setHideRequestOtpButton(!hideRequestOtpButton);
    };
  
    if(!hasFilled){
      return (
        <>
           <Navbar/>
            <div className="container my-3 py-3" style={{height:"50vh"}}>
              <h5 className="text-center">Phone Verification</h5>
              <hr />
                <div className="row my-4 h-100">
                  <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                    <label htmlFor="Phone" className="form-label text-black-50 m-0 small">Enter your phone number</label>
                      <form onSubmit={handleSubmit}>
                        <div className="my-3">
                          <PhoneInput 
                              id="Phone" 
                              name="Phone"
                              variant="outlined"
                              inputStyle={{width:"100%"}} 
                              country={"ke"}
                              onlyCountries={['ke', 'za', 'ng','gb']}
                              regions={['africa','europe']}
                              isValid={(value) => {
                                  if(value.length >= 12) {
                                      return true;
                                  }else{
                                      return false;
                                  }
                              }}                    
                              enableSearch={false}
                              value={phone}
                              placeholder="712345678"
                              countryCodeEditable={false}
                              onChange={(phone) => {setPhone('+'+phone)}}
                              minLength={13}
                              maxLength={18}
                              autoComplete="off"
                              required />
                          </div>
                          <div className="my-3 text-end">
                            <button className={"my-2 mx-auto btn fw-bold " + buttonStyle.custom_theme_button} type='submit'>Send Code</button>
                          </div>
                      </form>
                  </div>
                </div>
            </div>
            <Footer/>
            <div id="recaptcha"></div>
        </>
      ) 
    } else {
      return (
        <>
            <Navbar/>
            <div className="container my-3 py-3" style={{height:"50vh"}}>
              <div className="row my-4 h-100">
                <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                  <label htmlFor="OTP" className="form-label text-black-50 m-0 small" >Enter the OTP</label>
                  <input className="form-control" type="number" id="OTP" maxLength={6} value={otp} onChange={verifyOtp} />
                  <div className="my-2 text-end">
                    <div className="text-start">
                      <Link className="text-decoration-underline text-info" onClick={handleButtonShow} style={{display: showOtpRequestLink ? "" : "none"}}>Didn't get a verification code?</Link>
                    </div>
                    <button className={"my-1 mx-auto btn fw-bold " + buttonStyle.custom_theme_button} style={{display: hideRequestOtpButton ? "none" : "" }} >Request Code</button>
                </div>
                </div>
              </div>
            </div>
            <Footer />
            <div id="recaptcha"></div>
        </>
      )
    }
};

export default PhoneVerification;