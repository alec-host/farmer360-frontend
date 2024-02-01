import React,{ useState, useEffect } from "react";

import Avatar from "react-avatar";

import StoryModalComponent from "./modal/AddStoryModalComponent";
import InfiniteScrollComponent from "./InfiniteScrollComponent";
import { getSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";

const ConnectAndShareStoryPage = () => {

    const [storeData,setStoreData] = useState([]);

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data){
            setStoreData(stored_data);
        }
    },[]);

    return (
      <>
        <div className="container-fluid" style={{paddingTop:"10px",background:"",height:"auto"}}>
          <div className="container"> 
            <div className="row">
                    <div className="card py-3 gy-3">
                        <table>
                            <thead><tr><th/></tr></thead>
                            <tbody>
                                <tr>
                                    <td width="50px">
                                        <Avatar 
                                            color="#7E3794"
                                            size={50}
                                            className="me-1"
                                            name={storeData[0]?.first_name !== "" || typeof(storeData[0]?.first_name) !== "undefined" ? storeData[0]?.first_name : ""}
                                            round={true}  
                                        />                                    
                                    </td>
                                    <td>
                                        {<div><StoryModalComponent/></div>}
                                    </td>
                                </tr>
                                <tr><td colSpan={2}></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <table>
                        <thead><tr><th/></tr></thead>
                        <tbody>
                            <tr><td><InfiniteScrollComponent/></td></tr>
                        </tbody>
                    </table>
                    <div className="card py-3 gy-3">
                        <div className="content">
                            <hr/>
                            <p style={{fontSize:"14px"}}><span className="fa-regular fa-thumbs-up me-1"></span>Like<span className="me-5"></span><span className="fa-regular fa-comment me-1"></span>Comment</p>
                        </div>
                    </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default ConnectAndShareStoryPage;