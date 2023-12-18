import React,{ useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

//import Notiflix from 'notiflix';
//import { Loading } from 'notiflix/build/notiflix-loading-aio';

import { PRODUCT_KEY, PROFILE_KEY, readLocalCache } from "../../../db/localSessionData";
//import formattedDateTime from "../../../utility/format-current-date";

const WalletPage = () => {

    const [hideWallet, setHideWallet] = useState(false);
    const [storeData, setStoreData] = useState([]);
    const [storeProductData, setStoreProductData] = useState([]);
    //const [buttonDisabled, setButtonDisabled] = useState(false);

    const toggleProfileHide = () => {
        setHideWallet(!hideWallet);
    };

    useEffect(() => {
        const stored_data = readLocalCache(PROFILE_KEY);
        if(stored_data){
        setStoreData(stored_data);
        }
    },[]);

    useEffect(() => {
        const stored_data = readLocalCache(PRODUCT_KEY);
        if(stored_data){
        setStoreProductData(stored_data);
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
                                <tr><td><h5><strong>Wallet Balance</strong></h5></td></tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                <tr style={{display: storeData[0]?.first_name ? "" : "none"}}>
                                    <td><h5><strong></strong></h5></td>
                                    <td style={{textAlign:"end"}}>
                                        <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleProfileHide}><i className="" ></i>  View</NavLink>
                                    </td>
                                </tr>                     
                                <tr>
                                    <td colSpan={2}>
                                        <table style={{width:"100%",display: hideWallet ? "" :"none"}}>
                                            <thead><tr><th/></tr></thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="card">
                                                            <div className="content" style={{textAlign:"center",margin:"10px"}}>
                                                            <h1>KES0</h1>
                                                            </div>  
                                                        </div>
                                                        <button className="my-2 mx-auto btn btn-primary btn-md btn-block">Withdraw</button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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

export default WalletPage;
