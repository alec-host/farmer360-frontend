import React,{ useState, useEffect } from "react";

import { getSession } from "../../../../session/appSession";
import { PROFILE_SESSION } from "../../../../session/constant";
import ProfileAvatar from "../../../../components/ProfileAvatar";

const FarmerInformationPage = () => {

  const menuOption = new URLSearchParams(window?.location?.search).get('menu');

  const [storeProfileData, setStoreProfileData] = useState([]);

  const refIframe = React.useRef(null);

  const defaultUrl = "/farmer-list/?menu="+menuOption;
  
  useEffect(() =>{
    const stored_data = getSession(PROFILE_SESSION);
    if (stored_data) {
      setStoreProfileData(stored_data);
    }
  },[]); 

  return storeProfileData?.length > 0 ? (
    <>
      <div className="container-fluid" style={{background:"#F9F9F9",height:"auto"}}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
                {
                <div className="nav flex-column">
                    <ProfileAvatar
                      personEmail={storeProfileData[0]?.email}
                      personName={storeProfileData[0]?.business_name}
                    />
                </div>
                }
            </div>
            <div className="col-md-9">
              <div className="row">
                  <div className="section">
                      <div style={{position:"relative",paddingBottom:"170%",width:"100%",height:"auto"}}>
                            <iframe 
                            title="profile"
                            src={defaultUrl}
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

export default FarmerInformationPage;
