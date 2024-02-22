import React,{ useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";

import { getSession } from "../../session/appSession";
import { PROFILE_SESSION } from "../../session/constant";
import ProfileAvatar from "../../components/ProfileAvatar";

const ShareStoryPage = () => {

  const [storeProfileData, setStoreProfileData] = useState([]);

  const refIframe = React.useRef(null);

  const defaultUrl = "/dashboard/connect-share-stories/stories";

  const [iframeUrl, setIframeUrl] = useState(defaultUrl);
  
  useEffect(() =>{
    const stored_data = getSession(PROFILE_SESSION);
    if (stored_data) {
      setStoreProfileData(stored_data);
    }
  },[]);

  const handleOnClick = (e,page) => {
    e.preventDefault();
    setIframeUrl(page);
  };  

  return storeProfileData?.length > 0 ? (
    <>
      <div className="container-fluid" style={{background:"#F9F9F9",height:"auto"}}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className="nav flex-column">
                <ProfileAvatar 
                  personEmail={storeProfileData[0]?.email}
                  personName={storeProfileData[0]?.first_name === "N/A" && storeProfileData[0]?.last_name === "N/A" ? storeProfileData[0]?.business_name : storeProfileData[0]?.first_name + ' ' + storeProfileData[0]?.last_name}
                />
              </div>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <span>&nbsp;</span>
                </li>
                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-3" onClick={(e)=>handleOnClick(e,"/dashboard/wallet/wallet")} style={{color:"#0B51C1"}} to="#">
                    </Link> 
                </li>
              </ul>
            </div>
            <div className="col-md-9">
              <div className="row col-md-15">
                  <div className="section">
                      <div style={{position:"relative",paddingBottom:"170%",width:"100%",height:"auto"}}>
                            <iframe 
                            title="profile"
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
        </div>
      </div>
    </>
  ):<></>;
};

export default ShareStoryPage;