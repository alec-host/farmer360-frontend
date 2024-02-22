import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import axios from 'axios';
import Avatar from "react-avatar";
import LazyLoad from 'react-lazy-load';
import { isProfane } from 'no-profanity';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import formattedDateTime from "../../../utility/format-current-date";
import API_END_POINT from '../../../endpoint/apiRoute';
import { getSession } from '../../../session/appSession';
import { PROFILE_SESSION } from '../../../session/constant';
import { COMMENT_KEY, clearLocalCache, readLocalCache, storeOnLocalCache } from '../../../db/localSessionData';

import  styles from '../../../css/modal.module.css';

const InfiniteScrollComponent = () => {

    const [storeProfileData,setStoreProfileData] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [comments, setComments] = useState([]);
    const [showComment,setShowComment] = useState(false);
    const [componentId,setComponentId] = useState(0);
    const [storyID,setStoryID] = useState(0);
    const [fullName,setFullName] = useState(null);
    const [UUID,setUUID] = useState(null);
    const [thumbUpCount,setThumbUpCount] = useState(0);
    const [filter, setFilter] = useState(items);
    const [replyComment, setReplyComment] = useState('');

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data){
            if(typeof(stored_data[0]?.reference_number) !== "undefined"){
                getStories(stored_data[0]?.reference_number,stored_data[0]?.email);
            }
            setStoreProfileData(stored_data);
        };
    },[]);

    useEffect(() => {
        const stored_data = readLocalCache(COMMENT_KEY);
        if(stored_data){
            setComments(stored_data);
        };
    },[]);

    const getStories = async (reference_number,email) => {
        try {
            let url = null;
            setLoading(!loading);

            if(typeof(reference_number) !== "undefined"){
                url = `${API_END_POINT}/api/v1/getStories?owner_reference_number=${reference_number}&email=${email}&_page=${page}&_limit=10`;
            }else{
                url = `${API_END_POINT}/api/v1/getStories?owner_reference_number=${storeProfileData[0]?.reference_number}&email=${storeProfileData[0]?.email}&_page=${page}&_limit=10`;
            }
            const response = await axios.get(url);
            const newData = response?.data?.data;

            let dataSize = {};
            const total = response?.data?.message.split('-')[1];
            if(typeof(total) !== "undefined"){
                dataSize = total;
            }

            if(items.length <= dataSize){
                setItems((prevItems) => [...prevItems, ...newData]);
                setFilter((prevItems) => [...prevItems, ...newData]);

                setHasMore(newData.length === 10);
                setPage((prevPage) => prevPage + 1);
            }else{
                setLoading(loading);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(loading);
        }
    };

    const handleLikeClick = (e,id) => {
        setComponentId(id);
        setThumbUpCount(thumbUpCount+1);
    };

    const handleCommentClick = (e,id,post_uuid) => {
        setComponentId(id);
        setStoryID(post_uuid);
        setFullName(storeProfileData[0]?.first_name+' '+storeProfileData[0]?.last_name);
        setUUID(storeProfileData[0]?.reference_number);
        setShowComment(!showComment);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let formData = {};

        const hasProfaneWords = isProfane(replyComment);

        formData.post_uuid = storyID;
        formData.posted_comment = replyComment;
        formData.is_profane = hasProfaneWords;
        formData.owner_reference_number = UUID;
        formData.full_name = fullName;
        formData.date_created = formattedDateTime;

        httpPost(formData);

        console.log(formData);
    };

    const formatDate = (date) => {
        const options = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };
    
        // Format the date
        const formattedDate = new Date(date).toLocaleString('en-US', options);
    
        return formattedDate;
    };   

    const httpPost = (formData) => {

        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });

        setButtonDisabled(!buttonDisabled);

        fetch(`${API_END_POINT}/api/v1/createNewComment`,{
            method:'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'},
        })
        .then(async(response) => {
            await response.json().then(data=>{
                console.log(data);
                if(data?.success){
                    setStoryID(null);
                    setUUID(null);
                    setFullName(null);
                    clearLocalCache(COMMENT_KEY);
                    storeOnLocalCache(COMMENT_KEY,data?.data);
                    Notiflix.Notify.info('Comment posted',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    });
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);                
                }else{
                    Notiflix.Notify.warning('Failed to post comment',{
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

    const commentReplyForm = (storyData) => {
        return(
            <div key={storyData.$id} style={{display:showComment && componentId === storyData.$id ? "" : "none"}}>
                <p></p>
                <form onSubmit={handleSubmit}>
                    <input 
                        className="form-control" 
                        type="text" 
                        id="Comment" 
                        name="Comment"
                        onChange={(e) => setReplyComment(e.target.value)}
                        placeholder='Add a comment'
                        required
                    />
                    <p><input type="hidden" className="form-control" id="StoryID" name="StoryID" defaultValue={storyID ? storyID : ''} readOnly /></p>
                    <p><input type="hidden" className="form-control" id="Name" name="Name" defaultValue={fullName ? fullName : ''} readOnly /></p>
                    <p><input type="hidden" className="form-control" id="UUID" name="UUID" defaultValue={UUID ? UUID : ''} readOnly /></p>
                    <div className="content" style={{textAlign:"end"}}>
                        <button id="Reply" className="my-2 mx-auto btn btn-success" type="submit">Send</button>
                    </div>
                </form>
                <hr/>
                <div>{renderCommentList(storyID)}</div>
            </div>
        );
    };

    const renderCommentList = (id) => {
        const filtered_comments = comments.filter(item => item.story_uuid.trim() === storyID);
        if(id === storyID){}
        return (
            <>
                {filtered_comments?.map((comment) => (commentList(comment)))}
            </>
        );
    };

    const renderCommentCount = (id) => {
        const filtered_comments = comments.filter(item => item.story_uuid.trim() === id);
        return filtered_comments.length;
    };

    const filterStoryByTopic = () => {
        const searchWord = document.getElementById("MySearch").value;
        let filteredStoryList = null;
        if(searchWord && searchWord.length > 0){
            filteredStoryList = items.filter((data) => data.topic && data.topic?.trim().toLowerCase().includes(searchWord?.trim().toLowerCase()));
        }else{
            filteredStoryList = [];
        }
        
        setFilter(filteredStoryList);
        console.log(filter);
    };

    const handleOnClick = () => {filterStoryByTopic();};

    const commentList = (comment) => {
        return (
            <div key={comment.$id} className="row">
                <table>
                    <thead><tr><th/></tr></thead>
                    <tbody>
                        <tr>
                            <td width={"8%"} valign="top">
                                <table width={"100%"}>
                                    <thead><tr><th/></tr></thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Avatar 
                                                    color="#198754"
                                                    size={40}
                                                    name={ comment?.commenters_name !== "" || typeof(comment?.commenters_name) !== "undefined" ? comment?.commenters_name : "" }
                                                    round={true}  
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td colSpan={2}>
                                <div className={styles.message_container}>
                                    <div className={styles.message_bubble}>
                                        <table width={"100%"}>
                                            <thead><tr><th/></tr></thead>
                                            <tbody>
                                                <tr>
                                                    <td><small style={{fontSize:"12px"}}><strong>{comment?.commenters_name}</strong></small></td>
                                                    <td colSpan={2} style={{textAlign:"end"}}><small style={{fontSize:"12px"}}>{comment?.date_created ? formatDate(comment?.date_created) : null}</small></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <p></p>
                                        <i>{comment?.comment ? comment?.comment : null}</i>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };
    
    const renderStoryCardList = (storyData) =>{
        const forms = [];
        forms.push (
            <div className="card" key={storyData.$id} style={{marginTop:"25px",padding:"10px"}}>
                <div className="content">
                    <table style={{width:"100%",marginTop:"10px"}}>
                        <thead><tr><th/></tr></thead>
                        <tbody>
                            <tr>
                                <td width="50px">    
                                    <Avatar 
                                        color="#F2855C"
                                        size={50}
                                        name={ storyData?.full_name !== "" || typeof(storyData?.full_name) !== "undefined" ? storyData?.full_name : "" }
                                        round={true}  
                                    />
                                </td>
                                <td align="left">
                                    <table style={{width:"100%"}}>
                                        <thead><tr><th/></tr></thead>
                                        <tbody>
                                            <tr>
                                                <td><small><strong>{ storyData?.full_name !== "" || typeof(storyData?.full_name) !== "undefined" ? storyData?.full_name : "" }</strong></small></td>
                                                <td align="right"><small>{formatDate(storyData?.date_created)}</small></td>
                                            </tr>
                                        </tbody>
                                    </table>  
                                </td>
                            </tr>
                            <tr>
                                <td height={"10px"}></td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="content py-1"><small><strong>{ storyData?.topic !== "" || typeof(storyData?.topic) !== "undefined" ? storyData?.topic : "" }</strong></small></div>
                                    <div className={styles.message_container}>
                                        <div className={styles.message_bubble}>  
                                            <div className="content">{ storyData?.story !== "" || typeof(storyData?.story) !== "undefined" ? storyData?.story : "" }</div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <div className="content">
                                        {
                                        (storyData?.image_url) ? 
                                        <LazyLoad height={"100%"} width={"100%"} threshold={0.15}>    
                                            <img
                                                className="card-img-top"
                                                src={storyData?.image_url ? storyData?.image_url : "https://cdn4.iconfinder.com/data/icons/top-search-7/128/_image_file_image_photo_ui_gallery_picture-512.png"}
                                                alt="Image Card"
                                                width="50%"
                                            />
                                        </LazyLoad>
                                        : ''
                                        }
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="content">
                    <hr/>
                    <table style={{width:"100%"}}>
                        <thead><tr><th/></tr></thead>
                        <tbody>
                            <tr><td><div key={storyData?.$id}><small></small></div></td></tr>
                            <tr>
                                <td colSpan={2} style={{textAlign:"end"}}>
                                    <small style={{fontSize:"11px"}}>{renderCommentCount(storyData?.post_uuid) ? renderCommentCount(storyData?.post_uuid) + " comment(s)" : null }</small>
                                </td>
                            </tr>
                            <tr style={{color:"GrayText",display:"none"}}>
                                <td>
                                    <NavLink className="nav-link" key={storyData?.$id} onClick={e=>{handleLikeClick(e,storyData?.$id)}}><strong>  
                                        <span className="fa-regular fa-thumbs-up me-1"></span>Like</strong>
                                    </NavLink>
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <NavLink className="nav-link" key={storyData?.$id} onClick={e=>handleCommentClick(e,storyData?.$id,storyData?.post_uuid)}>
                                        <strong style={{color:"#198754",fontSize:"14px"}}><span key={storyData?.$id}></span><span className="fa-regular fa-comment me-1"></span>Comment</strong>
                                    </NavLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {commentReplyForm(storyData)}
                </div>
            </div>
        );
        return forms;
    };

    const SearchBar = () => {
        return(
            <div className="bg-white-opacity-40 backdrop-filter backdrop-blur-l px-4 pt-4 pb-6 rounded shadow max-w-[1100px] border border mx-auto">
                <div className="row mb-4 py-1">
                    <table style={{width:"100%"}}>     
                        <thead><tr><th/></tr></thead>
                            <tbody>
                            <tr>
                                <td style={{width:"90%"}}>
                                    <input 
                                        type="search" 
                                        className="form-control" 
                                        id="MySearch" 
                                        name="MySearch"
                                        aria-label="Search" 
                                        placeholder="Type a search word i.e topic"/>
                                </td>
                                <td>
                                    <button className="btn btn-outline-dark" onClick={handleOnClick}>Search</button>
                                </td>
                            </tr>
                        </tbody> 
                    </table>
                </div>
            </div>
        );
    };  
    
    return  (
        <>
            {<SearchBar/>}
            <InfiniteScroll
                key={1}
                dataLength={items.length}
                next={getStories}
                hasMore={hasMore}
                loader={<center><small><strong><span id="end">Loading...</span></strong></small></center>}
            >
                {filter?.map((item) => (renderStoryCardList(item)))}
                
            </InfiniteScroll>
        </>
    );
};

export default InfiniteScrollComponent;
