import React,{ useState, useEffect } from "react";

import { getSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";
import WalletTransactionPage from "./WalletTransactionPage";

const WalletBalancePage = () => {

    const [hideWallet, setHideWallet] = useState(false);
    const [storeProfileData, setStoreProfileData] = useState([]);

    const toggleProfileHide = () => {
        setHideWallet(!hideWallet);
    };

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data){
        setStoreProfileData(stored_data);
        }
    },[]);

    return storeProfileData?.length > 0 ? (
        <>
            <div className="container-fluid">
                <div className="container" style={{marginTop:"15px"}}>
                    <div className="row">
                            <table style={{width:"100%"}}>
                                <thead><tr><th/></tr></thead>
                                <tbody>
                                    <tr><td><h5><strong>Wallet Balance</strong></h5></td></tr>
                                    <tr><td colSpan={2}><hr /></td></tr>
                                    <tr style={{display: storeProfileData[0]?.account_type === "farmer" || storeProfileData[0]?.account_type === "business" ? "" : "none"}}>
                                        <td><h5><strong></strong></h5></td>
                                        <td style={{textAlign:"end"}}>
                                            <button className="btn btn-outline-success m-2" onClick={toggleProfileHide} disabled={storeProfileData[0]?.is_profile_completed === 0 ? true : false}>
                                                <i className="" ></i>  View
                                            </button>
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
    ):<></>;
};

export default WalletBalancePage;
