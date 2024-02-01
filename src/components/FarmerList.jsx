import React, { useState, useEffect } from "react";

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

import { Link, NavLink } from "react-router-dom";

import API_END_POINT from "../endpoint/apiRoute";
import { getSession } from "../session/appSession";
import { PROFILE_SESSION } from "../session/constant";

import formattedDateTime from "../utility/format-current-date";

const FarmerList = () => {

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

  useEffect(() => {
    const stored_data = getSession(PROFILE_SESSION);
    if(stored_data){
      setProfileData(stored_data);
    };

    getFarmersHomePage();

    Loading.init({className:customCss.notiflix_loading,});
  },[]);

  const getFarmersHomePage = async() => {
    const _limit = 10;
    try{
      if(typeof(_limit) !== 'undefined'){
        setLoading(true);

        const url = `${API_END_POINT}/api/v1/getFarmersHomePage?_page=${page}&_limit=${_limit}`;
      
        const response = await axios.get(url);
        const newData = response?.data?.data;

        let dataSize = {};

        const total = response?.data?.message.split('-')[1];
      
        dataSize = total;
   
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

    let formData = {};

    const formControlMessage = document.getElementsByClassName("form-control message");
    const MessageArr = [...formControlMessage].map(input => input.value);
    const message = MessageArr.filter((item) => item !== "");

    formData.action = "business";
    formData.body = message[0] || '';
    formData.recipient_uuid = recipientID;
    formData.sender_name = profileData[0]?.business_name;
    formData.sender_uuid = profileData[0]?.business_uuid;
    formData.date_created = formattedDateTime;

    setButtonDisabled(!buttonDisabled);

    Loading.standard({
        backgroundColor: 'rgba(0,0,0,0)',
    });

    console.log(formData);

    fetch(`${API_END_POINT}/api/v1/createNewInbox`,{
        method:'POST',
        body: JSON.stringify(formData),
        headers:{
            'Content-Type': 'application/json'
        }
    })
    .then(async(response) => {
        await response.json().then(data=>{
            console.log(data);
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

  const handleCommentClick = (e,id,uuid) => {
    setComponentId(id);
    setRecipientID(uuid);
    setDisplayComment(!displayComment);
  };

  const handleTagClick = (e,id,uuid) => {
    setComponentId(id);
    setRecipientID(uuid);
    setDisplayTag(!displayTag);
    alert('Coming soon...');
  };

  const FormLoading = () => {
    return (
      <>
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
      filteredFarmerList = farmerData.filter((item) => item.first_name?.toLowerCase() === name || item.last_name?.toLowerCase() === name || item.business_name?.toLowerCase() === name);
    }else{
      filteredFarmerList = farmerData;
    }
    setFilter(filteredFarmerList);
  }
 
  const renderFarmerList = (farmer) => {
    return(
      <div className="container" style={{background:""}}>
      <div className="col-md-10 col-sm-10">
      <div key={farmer.$id} className={"card mb-4 col-md-12" + " "+styles.justifyleft} style={{maxWidth:'40rem',paddingBlock:'15px',margin:'10px'}}>
        <div className="row g-0">
          <div className="col-md-5" style={{background:'#005b96',textAlign:'center'}}>
            <div className="content">
              <img
                className={styles.round}
                src={farmer.image_url ? farmer.image_url : "https://media.istockphoto.com/id/1144287292/photo/headshot-portrait-of-happy-mixed-race-african-girl-wearing-glasses.jpg?s=2048x2048&w=is&k=20&c=EDLruo1L13F8xiX5BAO1M1Tqw2UzrDdiFOFB_eze7dQ=" }
                alt="Card"
                width="220px"
                height="220px"
              />
            </div>
          </div>
          <div className="col-md-5">
            <div className="card-body">
              <h5 className="card-title"><b>{farmer.first_name && farmer.first_name !== 'N/A' ? farmer.first_name +' '+farmer.last_name : farmer.business_name}</b></h5>
              <p className="card-text"><small><b>Country</b>: {farmer.country}</small></p>
              <p className="card-text"><small><b>Crop/Livestock</b>: {farmer.farmed_items}</small></p>
              <p className="card-text"><small><b>Item(s) Available for Sale</b>: {farmer.sale_items}</small></p>
              <div className="card-text">
                <table cellPadding="1px" style={{width:'100%'}}>
                  <thead><tr><th/></tr></thead>
                  <tbody>
                    <tr>
                      <td style={{width:'35%'}}><small><b><Link>View Shop</Link></b> (Rating): </small></td>
                      <td>
                        <ReactStars
                          count={5}
                          value={farmer.shop_rating}
                          edit={false}
                          size={24}
                          isHalf={true}
                          activeColor="#ffd700"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table> 
                <NavLink className="nav-link" key={farmer?.$id} onClick={e=>handleCommentClick(e,farmer.$id,farmer.reference_number)}>
                  {/*<span key={farmer?.$id}></span><span className="fa-regular fa-comment me-2"></span>Contact Farmer*/}
                </NavLink>
                <div>
                {
                  contactFarmer(farmer)
                }
                </div>
                <NavLink className="nav-link" key={farmer?.$id+'1'} onClick={e=>handleTagClick(e,farmer.$id,farmer.reference_number)}>
                  {/*<span className="fa fa-user-tag me-2"></span>Tag Farmer*/}
                </NavLink>
                {
                  tagFarmer(farmer)
                }
              </div>
              <p className="card-text"><small></small></p>
              <p className="card-text"><small className="text-body-secondary"><span className={styles.more}></span></small></p>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
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
                <div className="content" style={{textAlign:"end"}}>
                  <button id="Reply" className="my-2 mx-auto btn btn-success" type="submit">Post</button>
                </div>
            </form>
        </div>
      </>
    );
  };

  const tagFarmer = (farmer) => {
    return (
      <>
        <div style={{display: displayTag && profileData[0].subscription === "free" & componentId === farmer.$id ? "" : "none"}}></div>
      </>
    );
  };
 
  const DisplayFarmersList = () => {
    return (
      <InfiniteScroll
          dataLength={farmerData.length}
          next={getFarmersHomePage}
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

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <nav className="navbar navbar-light">
            <input type="search" className="form-control" onChange={handleChange} placeholder="Type name..." aria-label="Search" />
          </nav>
          <div className="row">
            {loading ? <FormLoading /> : <DisplayFarmersList />}
          </div>
        </div>
      </div>
    </>
  );
};

export default FarmerList;