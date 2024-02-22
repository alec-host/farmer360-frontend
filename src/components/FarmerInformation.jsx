import React, { useState, useEffect, useRef } from "react";

import axios from 'axios';

import InfiniteScroll from 'react-infinite-scroll-component';

import ReactStars from "react-rating-stars-component";

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import "../css/profile.extra.module.css";
import styles from "../css/profile.module.css";
import customCss from "../css/custom.loading.module.css";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import API_END_POINT from "../endpoint/apiRoute";
import { getSession } from "../session/appSession";
import { PROFILE_SESSION } from "../session/constant";

import formattedDateTime from "../utility/format-current-date";
import Select from "react-select";
import { search_options } from "../db/optionsData";

const FarmerInformation = () => {

  const menuSelected = new URLSearchParams(window?.location?.search).get('menu');

  const inputOption = useRef(null);

  const [page, setPage] = useState(1);
  const [farmerData, setFarmerData] = useState([]);
  const [filter, setFilter] = useState(farmerData);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [profileData, setProfileData] = useState([]);
  const [componentId,setComponentId] = useState(0);
  const [recipientID,setRecipientID] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [displayComment,setDisplayComment] = useState(false);
  const [displayTag,setDisplayTag] = useState(false);
  const [placeholder,setPlaceholder] = useState(null);
  const [actionType,setActionType] = useState(null);

  useEffect(() => {
      const stored_data = getSession(PROFILE_SESSION);
      if(stored_data){
        if(typeof(stored_data[0]?.business_uuid) !== "undefined"){
          getFarmers(stored_data[0]?.business_uuid,stored_data[0]?.email,stored_data[0]?.subscription);
        }
        setProfileData(stored_data);
      };
      Loading.init({className:customCss.notiflix_loading,});
  },[]);

  const getFarmers = async(business_uuid,email,subscription) => {
    const _limit = 10;
    try{
      if(typeof(business_uuid) !== 'undefined'){
        setLoading(true);

        const url = `${API_END_POINT}/api/v1/getAllFarmers?business_uuid=${business_uuid}&email=${email}&_page=${page}&_limit=${_limit}`;
      
        const response = await axios.get(url);
        const newData = response?.data?.data;

        let dataSize = {};

        const total = response?.data?.message.split('-')[1];
      
        if(typeof(total) !== "undefined"){
          if(subscription === 'free'){
            dataSize = 5;
          }else{
            dataSize = total;
          }
        }

        if(farmerData.length <= dataSize){
          setFarmerData((prevItems) => [...prevItems, ...newData]);
          setFilter((prevItems) => [...prevItems, ...newData]);

          setHasMore(newData.length === _limit);
          setPage((prevPage) => prevPage + 1);
        }else{
          setLoading(loading);
        }
      }

    }catch(error){
      console.error('Error fetching data:', error);
    }finally{
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {

    event.preventDefault();

    setButtonDisabled(!buttonDisabled);

    Loading.standard({
        backgroundColor: 'rgba(0,0,0,0)',
    });


    let formData = {};

    const formControlMessage = document.getElementsByClassName("form-control message");
    const MessageArr = [...formControlMessage].map(input => input.value);
    const message = MessageArr.filter((item) => item !== "");

    formData.action = "business";
    formData.type = actionType;
    formData.date_created = formattedDateTime;

    if(actionType === "contact"){
      formData.body = message[0] || '';
      formData.recipient_uuid = recipientID;
      formData.sender_name = profileData[0]?.business_name;
      formData.sender_uuid = profileData[0]?.business_uuid;

      const url = `${API_END_POINT}/api/v1/createNewInbox`;
      
      httpPost(formData,url);
    }else{
      formData.notes = message[0] || '';
      formData.farmer_uuid = recipientID;
      formData.business_uuid = profileData[0]?.business_uuid;

      const url = `${API_END_POINT}/api/v1/createNoteAndTag`;

      httpPost(formData,url);
    }

    console.log(formData);
  };

  const httpPost = (formData,endPoint) => {
    fetch(endPoint,{
      method:'POST',
      body: JSON.stringify(formData),
      headers:{
          'Content-Type': 'application/json'
      }
  })
  .then(async(response) => {
      await response.json().then(data=>{
          if(data?.success){
              console.log(data?.data);
              Notiflix.Notify.info('Successful',{
                  ID:'SWA',
                  timeout:2950,
                  showOnlyTheLastOne:true                      
              }); 
              setTimeout(() => {
                  window.location.reload();
              }, 2000);                
          }else{
              Notiflix.Notify.warning('Outbound message has Failed',{
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

const handleCommentClick = (e,id,uuid,action) => {
    setComponentId(id);
    setRecipientID(uuid);
    setDisplayComment(!displayComment);
    setActionType(action);
  };

  const handleTagClick = (e,id,uuid,action) => {
    setComponentId(id);
    setRecipientID(uuid);
    setDisplayTag(!displayTag);
    setActionType(action);
  };

  const PageLoading = () => {
    return (
      <>
        <div className="col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterFarmers = (name) => {
    let filteredFarmerList = null;
    if(name){
      if(placeholder === "Type Name"){
        filteredFarmerList = farmerData.filter((item) => item.first_name?.toLowerCase().includes(name?.toLowerCase()) || item.last_name?.toLowerCase().includes(name?.toLowerCase()) || item.business_name?.toLowerCase().includes(name?.toLowerCase()));
      }else if(placeholder === "Type Country Name"){
        filteredFarmerList = farmerData.filter((item) => item.country?.toLowerCase().includes(name.toLowerCase()));
      }else if(placeholder === "Type Farmed Item"){
        filteredFarmerList = farmerData.filter((item) => item.farmed_items?.toLowerCase().includes(name.toLowerCase()));
      }
    }else{
      filteredFarmerList = farmerData;
    }
    setFilter(filteredFarmerList);
  }

  const renderFarmerList = (farmer) => {
    return(
      <>
      <div key={farmer.$id} className={"card mb-3 col-md-12" + " " + styles.justifyleft} style={{paddingBlock:'15px'}}>
        <div className="row g-0">
          <div className="col-md-5" style={{background:'#005b96',textAlign:'center'}}>
            <p></p>
            <img
              className={styles.round}
              src={farmer.image_url ? farmer.image_url : "../../../assets/farm.png" }
              alt="Card"
              width="220px"
              height="220px"
            />
            <p></p>
          </div>
          <div className="col-sm-7">
            <div className="card-body">
              <div style={{display: menuSelected && (menuSelected === "1" || menuSelected === "2" || menuSelected === "4") ? "":"none"}}>
                <h5 className="card-title"><b>{farmer.first_name && farmer.first_name !== 'N/A' ? farmer.first_name +' '+ farmer.last_name : farmer.business_name }</b></h5>
                <p className="card-text"><small><b>Country</b>: {farmer.country}</small></p>
                <p className="card-text"><small><b>Crop/Livestock</b>: {farmer.farmed_items}</small></p>
              </div>
              <div className="section" style={{display: menuSelected && menuSelected === "3" ? "":"none"}}>
                <h5 className="card-title"><b>{farmer.first_name && farmer.first_name !== 'N/A' ? farmer.first_name +' '+farmer.last_name : farmer.business_name}</b></h5>
                <p className="card-text"><small><b>Gender</b>: {farmer.gender}</small></p>
                <p className="card-text"><small><b>Email</b>: {farmer.email}</small></p>
                <p className="card-text"><small><b>Education</b>: {farmer.education_level}</small></p>
                <p className="card-text"><small><b>Country</b>: {farmer.country}</small></p>
                <p className="card-text"><small><b>Crop/Livestock</b>: {farmer.farmed_items}</small></p>
                <p className="card-text"><small><b>Item(s) Available for Sale</b>: {farmer.sale_items}</small></p>
                <div className="bg-white-opacity-401 backdrop-filter backdrop-blur-1 px-2 pt-2 rounded shadow-lg border border-info mx-auto">
                  <table cellPadding="1px" style={{width:'100%'}}>
                    <thead><tr><th/></tr></thead>
                    <tbody>
                      <tr>
                        <td style={{width:'35%'}}><small><b><button className="btn btn-outline-success">View Shop</button></b></small></td>
                      </tr>
                    </tbody>
                  </table>
                  <ReactStars
                    count={5}
                    value={farmer.shop_rating}
                    edit={false}
                    size={24}
                    isHalf={true}
                    activeColor="#ffd700"
                  />
                </div>
              </div>
              <p className="card-text"><small></small></p>
              <p className="card-text"><small className="text-body-secondary"><span className={styles.more}></span></small></p>
            </div>
              <div className="col-sm-12">
                <hr style={{display: menuSelected && menuSelected !== "2" ? "none":""}}/>
                  {
                    menuSelected && menuSelected === "2" ?
                    <button className="btn btn-md btn-block btn-outline-success" key={farmer?.$id} onClick={e=>handleCommentClick(e,farmer.$id,farmer.reference_number,"contact")}>
                      <span key={farmer?.$id}></span><span className="fa-regular fa-comment me-2"></span>Contact Farmer
                    </button>
                    :null
                  }
                <div>
                  {
                    contactFarmer(farmer)
                  }
                  <hr/>
                </div>
                  {
                    menuSelected && menuSelected === "4" ?
                    <button className="btn btn-md btn-block btn-outline-dark" key={farmer?.$id+'1'}  onClick={e=>handleTagClick(e,farmer.$id,farmer.reference_number,"note_tag")}>
                      <span className="fa fa-plus me-2"></span>Add Note
                    </button>
                    :null
                  }
                <div>
                  {
                    tagFarmer(farmer)
                  }
                  <hr style={{display: menuSelected && menuSelected !== "4"  ? "none":""}} />
                </div>
              </div>
          </div>
        </div>
      </div>
      </>
    );
  };

  const contactFarmer = (farmer) => {
    return(
      <>
        <div style={{display: displayComment && profileData[0].subscription === "free" & componentId === farmer.$id ? "" : "none"}}>
            <p></p>
            <form key={farmer.$id} onSubmit={handleSubmit}>
                <input 
                    className="form-control message" 
                    type="text" 
                    id={`Message-${farmer.$id}`}
                    name="Message"
                    placeholder='Type a message'
                    required
                />
                <p><input type="hidden" className="form-control" id="RecipientUUID" name="RecipientUUID" defaultValue={farmer.reference_number} readOnly /></p>
                <p><input type="hidden" className="form-control" id="Option" name="Option" defaultValue='contact' ref={inputOption} readOnly /></p>
                <div className="content" style={{textAlign:"end"}}>
                  <button id="Reply" className="my-2 mx-auto btn btn-success rounded-lg" type="submit">Send</button>
                </div>
            </form>
        </div>
      </>
    );
  };

  const tagFarmer = (farmer) => {
    return (
      <>
        <div style={{display: displayTag && profileData[0].subscription === "free" & componentId === farmer.$id ? "" : "none"}}>
          <p></p>
          <form key={farmer.$id} onSubmit={handleSubmit}>
              <input 
                  className="form-control message" 
                  type="text" 
                  id={`Message-${farmer.$id}`}
                  name="Message"
                  placeholder='Type a note'
                  required
              />
              <p><input type="hidden" className="form-control" id="RecipientUUID" name="RecipientUUID" defaultValue={farmer.reference_number} readOnly /></p>
              <p><input type="hidden" className="form-control" id="Option" name="Option" defaultValue='note_tag' ref={inputOption} readOnly /></p>
              <div className="content" style={{textAlign:"end"}}>
                <button id="Reply" className="my-2 mx-auto btn btn-success rounded-lg" type="submit">Tag</button>
              </div>
          </form> 
        </div>
      </>
    );
  };
 
  const DisplayFarmersList = () => {
    return (
      <InfiniteScroll
          key={1}
          dataLength={farmerData.length}
          next={getFarmers}
          hasMore={hasMore}
          loader={<center><small><strong><span id="end">Loading...</span></strong></small></center>}
      >
          
          {filter?.map((data) => (renderFarmerList(data)))}
          
      </InfiniteScroll>
    );
  };

  const handleChange = (e) => {
    filterFarmers(e.target.value);
  };

  const onSelectChange = (e) => {
    switch(e.value){
      case "":
        setPlaceholder(null);
      break;
      case "0":
        setPlaceholder("Type Name");
      break;
      case "1":
        setPlaceholder("Type Country Name");  
      break;
      case "2":
        setPlaceholder("Type Farmed Item");  
      break;
      default:break;
    }
  };

  return (
    <>
      <div className="container">
      <nav className="mb-3 container-fluid justify-content-center mt-3">
        <div className="bg-white-opacity-40 backdrop-filter backdrop-blur-l px-4 pt-4 pb-6 rounded shadow max-w-[1100px] border border mx-auto">
          <span className="fs-6 fw-normal text-muted">Filter by options below:</span>
          <div className="row g-1">
            <div className="col mb-5">
              <Select options={search_options} onChange={onSelectChange} />
            </div>
            <div className="col">
              <input 
                type="search" 
                className="form-control" 
                onChange={handleChange} 
                placeholder={placeholder ? placeholder : null} 
                aria-label="Search" 
                disabled={placeholder && placeholder.length > 1 ? false : placeholder === null ? true : false } 
              />
            </div>
          </div>
        </div>
      </nav>
        <div className="container-fluid justify-content-center">
          <div className="row">
            {loading ? <PageLoading /> : <DisplayFarmersList />}
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerInformation;
