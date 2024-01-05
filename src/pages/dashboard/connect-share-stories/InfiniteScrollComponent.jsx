import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import axios from 'axios';
import Avatar from "react-avatar";
import LazyLoad from 'react-lazy-load';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import formattedDateTime from "../../../utility/format-current-date";
import API_END_POINT from '../../../endpoint/apiRoute';
import { getSession } from '../../../session/appSession';
import { PROFILE_SESSION } from '../../../session/constant';
import { COMMENT_KEY, readLocalCache } from '../../../db/localSessionData';

import  styles from '../../../css/modal.module.css';



const InfiniteScrollComponent = () => {

    const [storeData,setStoreData] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [comments, setComments] = useState([]);
    const [replyComment,setReplyComment] = useState(null);
    const [showComment,setShowComment] = useState(false);
    const [componentId,setComponentId] = useState(0);
    const [storyID,setStoryID] = useState(0);
    const [fullName,setFullName] = useState(null);
    const [UUID,setUUID] = useState(null);
    const [thumbUpCount,setThumbUpCount] = useState(0);

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data){
            if(typeof(stored_data[0]?.reference_number) !== "undefined"){
                getStories(stored_data[0]?.reference_number,stored_data[0]?.email);
            }
            setStoreData(stored_data);
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
                url = `${API_END_POINT}/api/v1/getStories?owner_reference_number=${storeData[0]?.reference_number}&email=${storeData[0]?.email}&_page=${page}&_limit=10`;
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
        console.log(id);  
        setComponentId(id);
        setThumbUpCount(thumbUpCount+1);
    };

    //(e,storyData?.$id,storyData?.post_uuid,storyData?.commenters_name,storyData?.owner_reference_number)
    const handleCommentClick = (e,id,post_uuid,name,uuid) => {
        setComponentId(id);
        setStoryID(post_uuid);
        setFullName(name);
        setUUID(uuid);
        setShowComment(!showComment);
    };

    const handleOnChange = (e) => {
        setReplyComment(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let formData = {};

        formData.post_uuid = storyID;
        formData.posted_comment = replyComment;
        formData.owner_reference_number = UUID;
        formData.full_name = fullName;
        formData.date_created = formattedDateTime;

        httpPost(formData);

        console.log(formData);
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
                    setReplyComment(null);
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
            <>
                <div key={storyData.$id} style={{display:showComment && componentId === storyData.$id ? "" : "none"}}>
                    <p></p>
                    <form onSubmit={handleSubmit}>
                        <input 
                            className="form-control" 
                            type="text" 
                            id="Comment" 
                            name="Comment"
                            onChange={handleOnChange}
                            placeholder='Add a comment'
                            required
                        />
                        <p><input type="hidden" className="form-control" id="StoryID" name="StoryID" defaultValue={storyID ? storyID : ''} readOnly /></p>
                        <p><input type="hidden" className="form-control" id="Name" name="Name" defaultValue={fullName ? fullName : ''} readOnly /></p>
                        <p><input type="hidden" className="form-control" id="UUID" name="UUID" defaultValue={UUID ? UUID : ''} readOnly /></p>
                        <div className="content" style={{textAlign:"end"}}>
                            <button id="Reply" className="my-2 mx-auto btn btn-success" type="submit">Post</button>
                        </div>
                    </form>
                    <div>{renderCommentList(storyID)}</div>
                </div>
            </>
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

    const commentList = (comment) => {
        return (
            <div key={comment.$id} className="row" style={{margin:"2px"}}>
                <table>
                    <thead><tr><th/></tr></thead>
                    <tbody>
                        <tr>
                            <td><small><strong>{comment?.commenters_name}</strong></small></td>
                            <td style={{textAlign:"end"}}><small>{comment?.date_created ? comment?.date_created.split('T')[0] : null}</small></td>
                        </tr>
                        <tr>
                            <td colSpan={2}>
                                <textarea
                                    className={styles.button_like_input} 
                                    style={{fontSize:"16px",color:"#000",background:"#F2F2F2"}}
                                    rows={2}
                                    placeholder={comment?.comment ? comment?.comment : null}
                                    readOnly
                                />
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
            <div className="card" key={storyData.$id} style={{marginTop:"5px",padding:"10px"}}>
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
                                                <td align="right"><small>{(storyData?.date_created).split('T')[0]}</small></td>
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
                                    <div className="content">{ storyData?.story !== "" || typeof(storyData?.story) !== "undefined" ? storyData?.story : "" }</div>
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
                            <tr><td>{/*(componentId === storyData?.$id) ? thumbUpCount : 0 */}</td></tr>
                            <tr>
                                <td colSpan={3} style={{textAlign:"end"}}>
                                    <small>{renderCommentCount(storyData?.post_uuid) ? renderCommentCount(storyData?.post_uuid) + " comment(s)" : null }</small>
                                </td>
                            </tr>
                            <tr><td colSpan={3}><hr/></td></tr>
                            <tr>
                                <td>
                                    <NavLink className="nav-link" key={storyData?.$id} onClick={e=>{handleLikeClick(e,storyData?.$id)}}><strong style={{color:"GrayText",display:"none"}}>  
                                        <span className="fa-regular fa-thumbs-up me-1"></span>Like</strong>
                                    </NavLink>
                                </td>
                                <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td style={{textAlign:"end"}}>
                                    <NavLink className="nav-link" key={storyData?.$id} onClick={e=>handleCommentClick(e,storyData?.$id,storyData?.post_uuid,storyData?.full_name,storyData?.user_uuid)}>
                                        <strong style={{color:"#198754"}}><span key={storyData?.$id}></span><span className="fa-regular fa-comment me-1"></span>Comment</strong>
                                    </NavLink>
                                    <NavLink></NavLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {commentReplyForm(storyData)}
            </div>
        );
        return forms;
    };

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={getStories}
            hasMore={hasMore}
            loader={<center><small><strong><span id="end">Loading...</span></strong></small></center>}
        >
            {items?.map((item) => (renderStoryCardList(item)))}
            
        </InfiniteScroll>
    );
};

export default InfiniteScrollComponent;
