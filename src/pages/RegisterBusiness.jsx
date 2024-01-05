import React,{useEffect, useRef,useState} from 'react';
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import { Link } from 'react-router-dom';
import 'react-phone-input-2/lib/style.css'

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import { Footer, Navbar } from "../components";
import { category_options } from '../db/optionsData';
import formattedDateTime from '../utility/format-current-date';
import API_END_POINT from '../endpoint/apiRoute';

const RegisterBusiness = () => {

    const inputBusinessName = useRef(null);
    const inputRegisteredBy = useRef(null);
    const inputOwnerFullName = useRef(null);
    const inputEmail = useRef(null);
    const inputPhone = useRef(null);
    const inputPassword = useRef(null);
    const inputConfirmPassword = useRef(null);

    const [input,setInput] = useState({ Password: '', ConfirmPassword: '' });
    const [error,setError] = useState({ Password: '', ConfirmPassword: '' });
  
    const [selectedCategory,setSelectedCategory] = useState(category_options[0].value);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [phone,setPhone] = useState('');
    const [country,setCountry] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    const subscription = new URLSearchParams(window?.location?.search).get('subscription');

    useEffect(() =>{
        setCurrentDate(formattedDateTime);
    },[]);

    const onInputChange = e => {
        const { name, value } = e.target;
        setInput(prev => ({
          ...prev,
          [name]: value
        }));
        validateInput(e);
    }

    const validateInput = e => {
        let { name, value } = e.target;
        setError(prev => {
          const stateObj = { ...prev, [name]: "" };
          switch (name) {
            case "Password":
              if (!value) {
                stateObj[name] = "Please enter Password.";
              } else if (input.ConfirmPassword && value !== input.ConfirmPassword) {
                stateObj["ConfirmPassword"] = "Password Mismatch.";
              } else {
                stateObj["ConfirmPassword"] = input.ConfirmPassword ? "" : error.ConfirmPassword;
              }
              break;
     
            case "ConfirmPassword":
              if (!value) {
                stateObj[name] = "Please enter Confirm Password.";
              } else if (input.Password && value !== input.Password) {
                stateObj[name] = "Password Mismatch.";
              }
              break;

            default:
              break;
          }
          return stateObj;
        });
    };

    const handleInputChange = () => {};

    const handleRegistredByChange = (event) => {
        setSelectedCategory(event.value);
    };

    const handleSubmit = (event) => {

        let formData = {};

        event.preventDefault();

        if(inputPassword?.current?.value !== inputConfirmPassword?.current?.value){
            setButtonDisabled(true);
            Notiflix.Notify.failure('Password mismatch',{
                ID:'FWA',
                timeout:2950,
                showOnlyTheLastOne:true
            }); 
            setTimeout(() => {
                setButtonDisabled(false);  
            }, 2000);

            return;
        }else if(phone.length < 12) {
            setButtonDisabled(true);
            Notiflix.Notify.failure('Invalid phone number',{
                ID:'FWA',
                timeout:2950,
                showOnlyTheLastOne:true
            }); 
            setTimeout(() => {
                setButtonDisabled(false);  
            }, 2000);

            return;
        }else{

            setButtonDisabled(true);

            Loading.standard({
                backgroundColor: 'rgba(0,0,0,0.1)',
            });

            formData.business_name = inputBusinessName?.current.value || "";
            formData.email = inputEmail?.current?.value || "";
            formData.phone = inputPhone?.current?.value || phone;
            formData.owner_full_name = inputOwnerFullName?.current?.value || "";
            formData.subscription = subscription || "";
            formData.country = country;
            formData.password = inputPassword?.current?.value || "";
            formData.date_created = currentDate;

            console.log(formData);

            httpPost(formData);
        }
    };

    const httpPost = (formData) => {
        fetch(`${API_END_POINT}/api/v1/createNewBusinessAccount`,{
            method:'POST',
            body: JSON.stringify(formData),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(async(response) => {
            await response.json().then(data=>{
                console.log(data);
                if(data?.success){
                    inputBusinessName.current.value='';
                    inputEmail.current.value='';
                    inputPhone.current.value='';
                    inputOwnerFullName.current.value='';
                    setPhone('');
                    setCountry('');
                    input.Password='';
                    input.ConfirmPassword='';
                    Notiflix.Notify.info('Registration was successful',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    });
                }else{
                    let msg = null;
                    console.log(data?.message);
                    if(data?.message.includes('Document with the requested ID already exists')){
                        msg = 'Phone/Email is already in use';
                    }else{
                        msg = data?.message;
                    }
                    Notiflix.Notify.warning('Registration has Failed: '+msg,{
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
            <Navbar />
                <div className="container my-3 py-3">
                    <h5 className="text-center">Register</h5>
                    <hr />
                    <div className="row my-4 h-100">
                        <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                            <form onSubmit={handleSubmit}>
                                <div className="form my-3" id="DivBusinessName">
                                    <label htmlFor="Name">Business Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="Business"
                                        name="Business"
                                        onChange={handleInputChange}
                                        ref={inputBusinessName}
                                        maxLength={40}
                                        placeholder="Enter Business Name"
                                        required
                                    />
                                </div>                   
                                <div className="form my-3" id="DivRegisteredBy">
                                    <label htmlFor="Name">Registered By</label>
                                    <Select
                                        onChange={handleRegistredByChange}
                                        options={category_options}
                                        isOptionDisabled={(option) => option.disabled}
                                        required
                                    />
                                </div>
                                <div className="form my-3">
                                    <input
                                        type="hidden"
                                        className="form-control"
                                        id="RegisteredBy"
                                        name="RegisteredBy" 
                                        value={selectedCategory}
                                        ref={inputRegisteredBy}
                                    />
                                </div>                       
                                <div className="form my-3" id="DivFullName">
                                    <label htmlFor="Name">Owners Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="FullName"
                                        name="FullName"
                                        onChange={handleInputChange}
                                        ref={inputOwnerFullName}
                                        maxLength={60}
                                        placeholder="Enter Owners Name"
                                        required
                                    />
                                </div> 
                                <div className="form my-3">
                                    <label htmlFor="Email">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="Email"
                                        name="Email"
                                        onChange={handleInputChange}
                                        ref={inputEmail}
                                        placeholder="name@example.com"
                                        maxLength={25}
                                        required
                                    />
                                </div>
                                <div className="form my-3">
                                    <label htmlFor="Phone">Mobile Number</label>
                                    <PhoneInput
                                        id="Phone"
                                        name="Phone"
                                        country='ke'
                                        onlyCountries={['ke', 'za', 'ng','gb']}
                                        regions={['africa','europe','usa']}
                                        isValid={(value) => {
                                            if(value.length >= 12) {
                                                return true;
                                            }else{
                                                return false;
                                            }
                                        }}
                                        enableSearch={false}
                                        value={phone}
                                        ref={inputPhone}
                                        placeholder='712345678'
                                        countryCodeEditable={false}
                                        onChange={(phone,country) => {setPhone(phone); setCountry(country.name)}}
                                        minLength={13}
                                        maxLength={18}
                                        required={true}
                                    />
                                </div>
                                <div className="form my-3">
                                    <label htmlFor="Password">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="Password"
                                        name="Password"
                                        value={input.Password}
                                        onChange={onInputChange}
                                        onBlur={validateInput}
                                        ref={inputPassword}
                                        placeholder="Password"
                                        minLength={6}
                                        maxLength={25}
                                        required
                                    />
                                    {error.Password && <span className='err' style={{color:"red"}}><small>{error.Password}</small></span>}
                                </div>
                                <div className="form my-3">
                                    <label htmlFor="Confirm Password">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="ConfirmPassword"
                                        name="ConfirmPassword"
                                        value={input.ConfirmPassword}
                                        onChange={onInputChange}
                                        onBlur={validateInput}
                                        ref={inputConfirmPassword}
                                        placeholder="Confirm Password"
                                        minLength={6}
                                        maxLength={25}
                                        required
                                    />
                                    {error.ConfirmPassword && <span className='err' style={{color:"red"}}><small>{error.ConfirmPassword}</small></span>}
                                </div>
                                <div className="form my-3">
                                    <input
                                        type="hidden"
                                        className="form-control"
                                        value={subscription ? subscription : ''}
                                        placeholder="package"
                                    />
                                </div>                                                     
                                <div className="my-3">
                                    <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                                </div>
                                <div className="text-right">
                                    <button className="my-2 mx-auto btn btn-success" type="submit" disabled={buttonDisabled}> 
                                        Register
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            <Footer />
        </>
    )
}

export default RegisterBusiness