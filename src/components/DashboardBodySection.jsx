import React, { useRef,useState,useEffect } from "react";
import { PROFILE_SESSION } from "../session/constant";
import { getSession } from "../session/appSession";

import hideTextStyle from "../css/screen.hide.text.module.css";

const DashboardBodySection = () => {

  const defaultUrl = "/dashboard/default";  

  const refIframe = useRef(null);

  const [iframeUrl, setIframeUrl] = useState(defaultUrl);

  const [storeProfileData, setStoreProfileData] = useState([]);

  useEffect(() => {
    const stored_data = getSession(PROFILE_SESSION);
    if(stored_data) {
        setStoreProfileData(stored_data);
    }
  },[]);

  const handleOnClick = (e,page) => {
    e.preventDefault();
    setIframeUrl(page);
  }; 

  return  (
    <>       
        <div className="container my-1 py-1">
            <div className="row g-1">
                <div className="col-sm-12">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-light bg-success">
                            <div className="container-fluid">
                                <div className="container-fluid">
                                    <div className="col-auto">
                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="true" onClick={(e)=>{handleOnClick(e,"/dashboard/default");}}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-tachometer-alt"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Dashboard</span></div>
                                            </div>
                                        </div>

                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/edit-profile/stepper")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-user"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">My Profile</span></div>
                                            </div>
                                        </div>

                                        {
                                        storeProfileData[0]?.account_type === "business" ?
                                        <>  
                                            <div className="btn btn-success btn-sm">
                                                <div className="nav-link dropdown-toggle" data-toggle="dropdown" href="/#" role="button" aria-haspopup="true" aria-expanded="false">
                                                    <div className="row d-none d-xl-none">
                                                        <div className="col">
                                                            <i className="fas fa-tractor"></i>
                                                        </div>
                                                    </div>
                                                    <span className="d-lg-block"><i class="fas fa-tractor"></i></span>
                                                    <span className={"fw-bold small "+hideTextStyle.hide_on_small_screen}>Farmer's Information</span>          
                                                </div>
                                                <div className="nav-item dropdown" >
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item" href="/#" onClick={(e)=>handleOnClick(e,"/dashboard/business/farmer-data/?menu=1")}>Farmer's profile</a>
                                                        <div className="dropdown-divider"></div>
                                                        <a className="dropdown-item" href="/#" onClick={(e)=>handleOnClick(e,"/dashboard/business/farmer-data/?menu=2")}>Contact a farmer</a>
                                                        <div className="dropdown-divider"></div>
                                                        <a className="dropdown-item" href="/#" onClick={(e)=>handleOnClick(e,"/dashboard/business/farmer-data/?menu=3")}>Detailed insight</a>
                                                        <div className="dropdown-divider"></div>
                                                        <a className="dropdown-item" href="/#" onClick={(e)=>handleOnClick(e,"/dashboard/business/farmer-data/?menu=4")}>Notes and tagging</a>
                                                    </div>
                                                </div>
                                            </div>   
        
                                            <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/business/request-paid-service/?service=1")}>
                                                <div className="row">
                                                    <div className="col"><i className="fas fa-database"></i></div>
                                                    <div><span className="fw-bold small d-none d-lg-block">Api Request</span></div>
                                                </div>
                                            </div>                                        
    
                                            <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/business/request-paid-service/?service=2")}>
                                                <div className="row">
                                                    <div className="col"><i className="fas fa-poll"></i></div>
                                                    <div><span className="fw-bold small d-none d-lg-block">Survey Request</span></div>
                                                </div>
                                            </div>                                      
                                        </>
                                        :null
                                        }
                                        {
                                        storeProfileData[0]?.account_type === "farmer" ?
                                        <>                                    

                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/connect-share-stories")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-bullhorn"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Share Stories</span></div>
                                            </div>
                                        </div>                                    
    
                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/wallet")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-wallet"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Wallet</span></div>
                                            </div>
                                        </div>                                                                     
        
                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/inbox/inbox")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-inbox"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Inbox</span></div>
                                            </div>
                                        </div>                         
                                    
                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/shop")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-shopping-basket"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Shop</span></div>
                                            </div>
                                        </div>

                                        </>
                                        :null
                                        }
                                        
                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/setting")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-cogs"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Settings</span></div>
                                            </div> 
                                        </div> 
                                    </div> 
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
                <div className="container-fluid">
                    <div id="section"> 
                        <div style={{position:"relative",paddingBottom:"135vh",width:"100%",height:"100%"}}>
                            <iframe 
                                title="dashboard"
                                src={iframeUrl}
                                style={{position:"absolute",top:"0",left:"0",width:"100%",height:"100%"}}
                                allowFullScreen={true}
                                ref={refIframe}
                            >no iframe</iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default DashboardBodySection;
