import React, { useRef,useState,useEffect } from "react";
import { PROFILE_SESSION } from "../session/constant";
import { getSession } from "../session/appSession";

const DashboardBodySection = () => {
    
  const defaultUrl = "/dashboard/default";  

  const refIframe = useRef(null);

  const [iframeUrl, setIframeUrl] = useState(defaultUrl);

  const [storeData, setStoreData] = useState([]);

  useEffect(() => {
    const stored_data = getSession(PROFILE_SESSION);
    if(stored_data) {
        setStoreData(stored_data);
    }
  },[]);

  const handleOnClick = (e,page) => {
    e.preventDefault();
    setIframeUrl(page);
  }; 

  return (
    <>       
        <div className="container my-1 py-1">
            <div className="row g-1">
                <div className="container-fluid">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-light bg-success">
                            <div className="container-fluid">
                                {/*
                                <button className="navbar-toggler mx-2" type="button" data-toggle={"collapse"}  data-target="#navDashSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navDashSupportedContent">                             
                                </div>
                                */}
                                <div className="container">
                                    <a href="/#"className="navbar-brand">&nbsp;</a>
                                    <button className="btn btn-success" data-bs-toggle="" aria-expanded="true" onClick={(e)=>{handleOnClick(e,"/dashboard/default");}}>
                                        <h6>Dashboard</h6>
                                    </button>
                                    <a href="/#" className="navbar-brand">&nbsp;</a>
                                    <button className="btn btn-success" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/edit-profile/stepper")}>
                                        <h6><strong>My Profile</strong></h6>
                                    </button>
                                    {
                                    storeData[0]?.account_type === "business" ?
                                    <>    
                                    <a href="/#" className="navbar-brand">&nbsp;</a>
                                    <button className="btn btn-success" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/business/farmer-data")}>
                                        <h6><strong>Farmer's Data</strong></h6>
                                    </button> 
                                    </>
                                    :null
                                    }
                                    {
                                    storeData[0]?.account_type === "farmer" ?
                                    <>                                                                         
                                    <a href="/#" className="navbar-brand">&nbsp;</a>
                                    <button className="btn btn-success" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/inbox/inbox")}>
                                        <h6><strong>Inbox</strong></h6>
                                    </button>                            
                                    <a href="/#" className="navbar-brand">&nbsp;</a> 
                                    <button className="btn btn-success" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/shop")}>
                                        <h6><strong>Shop</strong></h6>
                                    </button>
                                    </>
                                    :null
                                    }
                                    <a href="/#" className="navbar-brand">&nbsp;</a>
                                    <button className="btn btn-success" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/setting")}>
                                        <h6><strong>Settings</strong></h6>
                                    </button> 
                                </div> 
                            </div>
                        </nav>
                    </div>
                </div>
                <div className="container-fluid" style={{marginTop:"5px"}}>
                    <div id="section"> 
                        <div style={{position:"relative",paddingBottom:"150%",width:"100%",height:"100%"}}>
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
