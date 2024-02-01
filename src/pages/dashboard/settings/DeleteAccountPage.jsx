import React,{ useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

//import Notiflix from 'notiflix';
//import { Loading } from 'notiflix/build/notiflix-loading-aio';

import { getSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";
//import formattedDateTime from "../../../utility/format-current-date";

const DeleteAccountPage = () => {

    const [hideWallet, setHideWallet] = useState(false);
    const [storeData, setStoreData] = useState([]);

    const toggleProfileHide = () => {
        setHideWallet(!hideWallet);
    };

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data){
        setStoreData(stored_data);
        }
    },[]);

    return (
        <>
            <div className="container-fluid">
                <div className="container" style={{marginTop:"15px"}}>
                    <div className="row">
                            <table style={{width:"100%"}}>
                                <thead><tr><th/></tr></thead>
                                <tbody>
                                <tr><td><h5><strong>Delete Account</strong></h5></td></tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                <tr>
                                    <td></td>
                                    <td style={{textAlign:"end"}}>
                                        <NavLink to="#" className="btn btn-outline-danger m-2" onClick={toggleProfileHide}><i className="" ></i>  Delete</NavLink>
                                    </td>
                                </tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                </tbody>
                            </table>          
                    </div>
                </div>
            </div>
        </>
    );
    };

export default DeleteAccountPage;
