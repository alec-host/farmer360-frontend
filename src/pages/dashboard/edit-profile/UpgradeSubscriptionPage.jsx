import React,{ useState, useEffect } from "react";

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import API_END_POINT from "../../../endpoint/apiRoute";
import { getSession, setSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";
import PaymentPage from "../../../components/payment/PaymentPage";

const UpgradeSubscriptionPage = () => {

  const [storeProfileData, setStoreProfileData] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    const stored_data = getSession(PROFILE_SESSION);
    if(stored_data){
      setStoreProfileData(stored_data);
    }
  },[]);
  
  const handleSubmit = (event) => {

    const formData = {};

    event.preventDefault();

    setButtonDisabled(!buttonDisabled);

    Loading.standard({
        backgroundColor: 'rgba(0,0,0,0)',
    });

    formData.email = storeProfileData[0]?.email || "";
    formData.owner_reference_number = storeProfileData[0]?.reference_number || "";
    if(storeProfileData[0]?.account_type === "farmer"){
      formData.subscription = storeProfileData[0]?.subscription === "basic" ? "advance" : "basic";
    }
    formData.database_id = storeProfileData[0]?.$databaseId || "";
    formData.table_id = storeProfileData[0]?.$collectionId || "";
    formData.record_id = storeProfileData[0]?.$id || "";

    fetch(`${API_END_POINT}/api/v1/switchSubscription`,{
        method:'PATCH',
        body: JSON.stringify(formData),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(async(response) => {
        await response.json().then(data=>{
            if(data?.success){
                setStoreProfileData([data?.data]);
                Notiflix.Notify.info('Subscription switch successful',{
                    ID:'SWA',
                    timeout:2950,
                    showOnlyTheLastOne:true                      
                }); 
                setTimeout(() => {
                    window.location.reload();
                }, 2000);  
                setSession(PROFILE_SESSION,storeProfileData);              
            }else{
                Notiflix.Notify.warning('Subscription switch has Failed',{
                    ID:'FWA',
                    timeout:2950,
                    showOnlyTheLastOne:true
                }); 
            }
            setButtonDisabled(buttonDisabled);
            Loading.remove(1523);
        });
    })
    .catch(async(error) => {
        console.error(await error);
    });
  };

  return storeProfileData?.length > 0 ? (
    <>
      <div className="container-fluid">
        <div className="container" style={{marginTop:"15px"}}>
          <div className="row">
                <table style={{width:"100%"}}>
                  <thead><tr><th/></tr></thead>
                    <tbody>
                      <tr><td><h5><strong>Subscription Information</strong></h5></td></tr>
                      <tr><td colSpan={2}><hr /></td></tr>
                      <tr>
                          <td>
                              <form onSubmit={handleSubmit}>
                                  <table style={{width:"100%"}}>
                                    <thead><tr><th/></tr></thead>
                                      <tbody>
                                        <tr>
                                            <td><h6><strong></strong></h6></td>
                                            <td className="text-right">

                                                {
                                                  storeProfileData[0]?.account_type === "farmer" ?
                                                    storeProfileData[0]?.account_type === "farmer" && storeProfileData[0]?.subscription === "basic" ?
                                                    <PaymentPage SubscriptionFee={storeProfileData[0]?.subscription === "basic" ? "$10":"$10"} ButtonLabel={"Upgrade"} />
                                                    :
                                                    storeProfileData[0]?.account_type === "farmer" && storeProfileData[0]?.subscription === "advance" ?
                                                    <button className={"btn btn-secondary m-2"} type="button" disabled={true}><i></i>Upgrade</button>
                                                    :
                                                    null
                                                  :
                                                    storeProfileData[0]?.account_type === "business" && storeProfileData[0]?.subscription  === "advance" ?
                                                    <button className={"btn btn-secondary m-2"} type="button" disabled={true}><i></i>Upgrade</button>
                                                    :
                                                    storeProfileData[0]?.account_type === "business" && (storeProfileData[0]?.subscription  === "free" || storeProfileData[0]?.subscription  === "standard")  ?
                                                    <PaymentPage SubscriptionFee={storeProfileData[0]?.subscription === "free" ? "$65" : "$150" } ButtonLabel={"Upgrade"} />
                                                    :
                                                    null
                                                }
                                            </td>                    
                                        </tr>
                                        <tr><td colSpan={2}><strong>Active package</strong>:&nbsp;&nbsp;<span style={{color:"#008000",fontSize:"16px",textTransform:"uppercase"}}><strong>{storeProfileData[0]?.subscription}</strong></span></td></tr>
                                        <tr><td colSpan={2}><hr /></td></tr>
                                      </tbody>
                                  </table>
                              </form>
                          </td> 
                      </tr>
                    </tbody> 
                </table>    
          </div>
        </div>
      </div>
    </>
  ):<></>;
};

export default UpgradeSubscriptionPage;
