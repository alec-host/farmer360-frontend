import React, { useRef,useState,useEffect } from "react";
import { getSession } from "../../session/appSession";
import { PROFILE_SESSION } from "../../session/constant";

const AdminDashboardBodySection = () => {
  
  const defaultUrl =  "/admin/dashboard/default";  

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

  return (
    <>       
        <div className="container my-1 py-1">
            <div className="row g-1">
                <div className="col-sm-12">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-light bg-success">
                            <div className="container-fluid">
                                <div className="container-fluid">
                                    <div className="col-auto">
                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="true" onClick={(e)=>{handleOnClick(e,"/admin/dashboard/default");}}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-tachometer-alt"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Dashboard</span></div>
                                            </div>
                                        </div>
                                       
                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/admin/dashboard/inbox/inbox")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-inbox"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Inbox</span></div>
                                            </div>
                                        </div>                                      
                                        
                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/admin/dashboard/story-comment/story")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-comment-alt"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Blocked Stories</span></div>
                                            </div>
                                        </div> 
                                        
                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/admin/dashboard/story-comment/comment")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-comments"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Blocked Comments</span></div>
                                            </div>
                                        </div>                                                                                                                              

                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/admin/dashboard/request/api")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-database"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Api Request</span></div>
                                            </div>
                                        </div>

                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/admin/dashboard/request/survey")}>
                                            <div className="row">
                                                <div className="col"><i className="fas fa-poll"></i></div>
                                                <div><span className="fw-bold small d-none d-lg-block">Survey Request</span></div>
                                            </div>
                                        </div>         
         
                                        <div className="btn btn-success btn-sm" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/admin/dashboard/settings")}>
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
                <div className="container-fluid" style={{marginTop:"5px",height:"auto"}}>
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

export default AdminDashboardBodySection;
