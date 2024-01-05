import React, { useEffect,useState } from "react";
import { NavLink } from "react-router-dom";
import Avatar from 'react-avatar';

import styles from "../css/nav.module.css";
import { COMMENT_KEY, PRODUCT_KEY, STORE_KEY, clearLocalCache } from "../db/localSessionData";
import { deleteSession, getSession } from "../session/appSession";
import { PROFILE_SESSION } from "../session/constant";

const DashboardNavHeader = () => {

const [storeData, setStoreData] = useState([]);

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data) {
            setStoreData(stored_data);
        }
    },[]); 

    const handleOnClick = () => {
        deleteSession(PROFILE_SESSION);
        clearLocalCache(COMMENT_KEY);
        clearLocalCache(STORE_KEY);
        clearLocalCache(PRODUCT_KEY);
    };

    return (
        <>
            <nav className={"navbar navbar-expand-lg navbar-dark "+styles.bg_nav_color+" py-3 sticky-top"}>
                <div className="container">
                    <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> GrowAgric</NavLink>
                    <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav m-auto my-2 text-center"></ul>
                        <div className="dropdown"> 
                            <a href="/#" className="d-flex align-items-center link-body-emphasis text-decoration-none dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                &nbsp;&nbsp;
                                <Avatar 
                                    colors={['#FCCF0A', '#0B51C1', '#3A6024','#B3003C','#7E3794','#F2855C']}
                                    name={storeData[0]?.email}
                                    size={45}
                                    round={true} 
                                />
                                {
                                storeData[0]?.account_type === "farmer" ? 
                                <span>&nbsp;{storeData[0]?.first_name === "N/A" && storeData[0]?.last_name === "N/A" ? storeData[0]?.business_name : storeData[0]?.first_name }&nbsp;</span>
                                :
                                <span>&nbsp;{ storeData[0]?.business_name }&nbsp;</span>
                                }
                            </a>
                            <ul className="dropdown-menu text-small shadow text-left">
                                <li><hr className="dropdown-divider"/></li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login" onClick={handleOnClick}>&nbsp;&nbsp;&nbsp;&nbsp;Sign out</NavLink>
                                </li>                                                                                                                                                          
                            </ul>
                        </div> 
                        <div>
                            {/*
                            <ul class="nav navbar-nav" id="navbarSupportedContent">
                                <li><a href="/#">Dashboard</a>
                                </li>
                                <li><a href="">Profile</a>
                                </li>
                                <li><a href="">Inbox</a>
                                </li>
                                <li><a href="">Shop</a>
                                </li>   
                                <li><a href="">Settings</a>
                                </li>                                 
                            </ul> 
                            */}   
                        </div>                     
                    </div>
                </div>
            </nav>
        </>
    );
};

export default DashboardNavHeader;
