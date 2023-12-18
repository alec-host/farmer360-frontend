import React, { useRef,useState } from "react";

const DashboardBodySection = () => {
    
  const defaultUrl = "/dashboard/default";  

  const refIframe = useRef(null);

  const [iframeUrl, setIframeUrl] = useState(defaultUrl);
  const [expanded, setExpanded] = useState("collapse");

  const handleOnClick = (e,page) => {
    e.preventDefault();
    console.log(e.target);
    setIframeUrl(page);
    setExpanded("collapse");
  }; 
  
  const handleMenuCollapse = () => {
    alert('dddddddddddddd');
  };

  return (
    <>       
        <div className="container my-1 py-1">
            <div className="row g-1">
                <div className="container-fluid">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg navbar-light bg-success">
                            <div className="container-fluid">
                                <button className="navbar-toggler mx-2" type="button" data-toggle={expanded ? "collapse" : ""} data-target="#navDashSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navDashSupportedContent">
                                    <div className="container">
                                        <a href="/#"className="navbar-brand">&nbsp;</a>
                                        <button className="btn btn-success" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/default")}>
                                            <h6>Dashboard</h6>
                                        </button>
                                        <a href="/#" className="navbar-brand">&nbsp;</a>
                                        <button className="btn btn-success" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/edit-profile/stepper")}>
                                            <h6><strong>Profile</strong></h6>
                                        </button>
                                        <a href="/#" className="navbar-brand">&nbsp;</a>
                                        <button className="btn btn-success" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/inbox/inbox")}>
                                            <h6><strong>Inbox</strong></h6>
                                        </button>                            
                                        <a href="/#" className="navbar-brand">&nbsp;</a>
                                        <button className="btn btn-success" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/shop")}>
                                            <h6><strong>Shop</strong></h6>
                                        </button>
                                        <a href="/#" className="navbar-brand">&nbsp;</a>
                                        <button className="btn btn-success" data-bs-toggle="" aria-expanded="false" onClick={(e)=>handleOnClick(e,"/dashboard/setting")}>
                                            <h6><strong>Settings</strong></h6>
                                        </button> 
                                    </div>                              
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
