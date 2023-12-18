import React,{ useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import API_END_POINT from "../../../endpoint/apiRoute";

import storeInitialLocalData, { readLocalStoredData } from "../../../db/localSessionData";

const EditSignInSecurityPage = () => {

    const inputPassword = useRef(null);
    const inputConfirmPassword = useRef(null);

    const [input, setInput] = useState({ Password: '', ConfirmPassword: '' });
    const [error, setError] = useState({ Password: '', ConfirmPassword: '' });
    const [hideChangePassword, setHideChangePassword] = useState(false);
    const [storeData, setStoreData] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [trackDataChange,setTrackDataChange] = useState(false);

    const toggleChangePassword = () => {
        setHideChangePassword(!hideChangePassword);
    };

    useEffect(() => {
        const stored_data = readLocalStoredData();
        if(stored_data) {
            setStoreData(stored_data);
        }
    },[]);

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

    const onInputChange = e => {
        const { name, value } = e.target;
        setInput(prev => ({
          ...prev,
          [name]: value
        }));
        validateInput(e);
    };
  
    const onSubmitHandler = (event) => {

        let formData = {};

        event.preventDefault();

        if( inputPassword?.current?.value !== inputConfirmPassword?.current?.value){

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
        }else{

            setButtonDisabled(true);

            Loading.standard({
                backgroundColor: 'rgba(0,0,0,0)',
            });

            formData.action = "pass";
            formData.phone = storeData[0]?.msisdn || "";
            formData.email = storeData[0]?.email || "";
            formData.password = inputPassword?.current?.value || "";
            formData.confirm_password = inputConfirmPassword?.current?.value || "";
            formData.database_id = storeData[0]?.$databaseId || "";
            formData.table_id = storeData[0]?.$collectionId || "";
            formData.record_id = storeData[0]?.$id || "";

            fetch(`${API_END_POINT}/api/v1/changeUserPassword`,{
                method:'PATCH',
                body: JSON.stringify(formData),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(async(response) => {
                await response.json().then(data => {
                    if(data?.success){
                        inputPassword.current.value='';
                        inputConfirmPassword.current.value='';
                        Notiflix.Notify.info('Password change was Successful',{
                            ID:'SWA',
                            timeout:2950,
                            showOnlyTheLastOne:true                      
                        }); 
                        setStoreData(data?.data);
                        setTrackDataChange(!trackDataChange);
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000); 
                    }else{
                        Notiflix.Notify.warning('Password change has Failed',{
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
        }
    };

    if(trackDataChange === true){
        storeInitialLocalData(storeData);
    }

    return (
        <>
            <div className="container-fluid">
                <div className="container" style={{marginTop:"15px"}}>
                    <form onSubmit={onSubmitHandler}>
                        <table style={{width:"100%"}}>
                            <thead><tr><th/></tr></thead>
                            <tbody>
                                <tr><td><h5><strong>Sign-in & Security</strong></h5></td></tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                <tr>
                                    <td><h6><strong>&nbsp;&nbsp;Password</strong></h6></td>
                                    <td colSpan={2} style={{textAlign:"end"}}>
                                        <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleChangePassword} ><i className=""></i> Edit</NavLink>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <table style={{width:"100%",display: hideChangePassword ? "" : "none"}}>     
                                            <thead><tr><th/></tr></thead>
                                            <tbody>                  
                                                <tr>
                                                    <td colSpan={2}>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            id="Password"
                                                            name="Password"
                                                            value={input.Password}
                                                            ref={inputPassword}
                                                            placeholder="New Password"
                                                            onChange={onInputChange}
                                                            onBlur={validateInput}
                                                            minLength={6}
                                                            maxLength={25}
                                                            required
                                                        />
                                                        {error.Password && <span className='err' style={{color:"red"}}><small>{error.Password}</small></span>}
                                                    </td>
                                                </tr>
                                                <tr><td style={{height:"10px"}}></td></tr>
                                                <tr>
                                                    <td colSpan={2}>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            id="ConfirmPassword"
                                                            name="ConfirmPassword"
                                                            value={input.ConfirmPassword}
                                                            ref={inputConfirmPassword}
                                                            placeholder="Confirm Password"
                                                            onChange={onInputChange}
                                                            onBlur={validateInput}
                                                            minLength={6}
                                                            maxLength={25}
                                                            required
                                                        />
                                                        {error.ConfirmPassword && <span className='err' style={{color:"red"}}><small>{error.ConfirmPassword}</small></span>}
                                                    </td>
                                                </tr> 
                                                <tr>
                                                    <td style={{textAlign:"end",width:"100%"}}>
                                                        <button id="btnCancelProfile" className="my-2 mx-auto btn btn-dark" onClick={toggleChangePassword} type="button">
                                                            Cancel
                                                        </button>
                                                    </td>
                                                    <td style={{textAlign:"end"}}>
                                                        <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={buttonDisabled}>
                                                            Save
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>                                      
                                        </table>
                                    </td>
                                </tr>                        
                                <tr>
                                    <td colSpan={2}><hr /></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditSignInSecurityPage;
