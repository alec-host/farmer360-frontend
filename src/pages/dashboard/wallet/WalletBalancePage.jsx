import React,{ useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { getSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";
import WalletTransactionPage from "./WalletTransactionPage";

const WalletBalancePage = () => {

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
                                    <tr><td><h5><strong>Wallet Balance</strong></h5></td></tr>
                                    <tr><td colSpan={2}><hr /></td></tr>
                                    <tr style={{display: storeData[0]?.account_type === "farmer" || storeData[0]?.account_type === "business" ? "" : "none"}}>
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
                                                                <div className="content fw-bold text-center mt-1 fs-2">KES0</div>  
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
            <WalletTransactionPage />
        </>
    );
    };

export default WalletBalancePage;
