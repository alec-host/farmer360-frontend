import React,{ useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { STORE_KEY, readLocalCache } from "../../db/localSessionData";

import ProfileAvatar from "../../components/ProfileAvatar";

const ShopPage = () => {

  const [storeShopData, setStoreShopData] = useState([]);

  const refIframe = React.useRef(null);

  const defaultUrl = "/dashboard/shop/create-shop";

  const [iframeUrl, setIframeUrl] = useState(defaultUrl);

  const handleOnClick = (e,page) => {
    e.preventDefault();
    setIframeUrl(page);
  };  

  useEffect(() =>{
    const stored_data = readLocalCache(STORE_KEY);
    if (stored_data) {
      setStoreShopData(stored_data);
    }
  },[]);

  return (
    <>
      <div className="container-fluid" style={{marginTop:"0px",background:"#F9F9F9",width:"100%",height:"auto"}}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-3">
              <div className="nav flex-column">
                <ProfileAvatar 
                  personEmail={storeShopData[0]?.name ? storeShopData[0]?.name : "My Shop"}
                  personName={storeShopData[0]?.name ? storeShopData[0]?.name : "My Shop"}
                />
              </div>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <span>&nbsp;</span>
                </li>                
                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-3" onClick={(e)=>handleOnClick(e,"/dashboard/shop/create-shop")} style={{color:"#0B51C1"}} to="#">
                      Create Shop
                    </Link>
                </li>               
                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-3" onClick={(e)=>handleOnClick(e,"/dashboard/shop/add-product")} style={{color:"#0B51C1"}} to="#">
                      Add Product
                    </Link>
                </li> 
                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-3" onClick={(e)=>handleOnClick(e,"/dashboard/shop/add-inventory")} style={{color:"#0B51C1"}} to="#">
                      Add Inventory (stock)
                    </Link>
                </li>                                             
                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-3" onClick={(e)=>handleOnClick(e,"/dashboard/shop/add-inventory")} style={{color:"#0B51C1"}} to="#">
                    &nbsp;
                    </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-9">
              <div className="row col-md-15">
                  <div id="section">
                      <div style={{position:"relative",paddingBottom:"150%",width:"100%",height:"auto"}}>
                            <iframe 
                              title="shop"
                              src={iframeUrl}
                              style={{position:"absolute",top:"0",left:"0",width:"100%",height:"100%"}}
                              allowFullScreen={true}
                              ref={refIframe}
                              >no iframe
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </div>
  </>
  );
};

export default ShopPage;
