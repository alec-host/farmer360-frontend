import React,{ useState, useEffect, useRef } from "react";
import axios from  'axios';

import DataTable from 'react-data-table-component';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';


import datatableStyle from "../../../css/datatable.module.css";
import FilterComponent from "../../../components/FilterComponent";
import makeTextBold from "../../../components/BoldTextComponent";

import formattedDateTime from "../../../utility/format-current-date";
import API_END_POINT from "../../../endpoint/apiRoute";

import { getSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";

import { INBOX_KEY, clearLocalCache, readLocalCache, storeOnLocalCache } from "../../../db/localSessionData";

const InboxPage = () => {

    const inputMessage = useRef("");
    const [hideProfile, setHideProfile] = useState(false);
    const [hideReply, setHideReply] = useState(false);
    const [storeProfileData, setStoreProfileData] = useState([]);
    const [storeInboxData, setStoreInboxData] = useState([]);
    const [inboxSubject, setInboxSubject] = useState([]);
    const [inboxBody, setInboxBody] = useState([]);
    const [userReferenceNumber,setUserReferenceNumber] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [trackDataChange,setTrackDataChange] = useState(false);

    const [databaseId, setDatabaseId] = useState([]);
    const [documentId, setDocumentId] = useState([]);
    const [collectionId, setCollectionId] = useState([]);

    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const toggleProfileHide = () => {
        setHideProfile(!hideProfile);
    };

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data){
            setStoreProfileData(stored_data);
        }
    },[]);

    useEffect(() => {
        const stored_data = readLocalCache(INBOX_KEY);
        if(stored_data){
            setStoreInboxData(stored_data);
        }
    },[]);

    const filteredItems = storeInboxData.filter(
        item =>
          JSON.stringify(item)
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
    );

    const handleRefresh = () => {
        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });
        clearLocalCache(INBOX_KEY);
        console.log(storeProfileData);
        getInbox();
        Loading.remove(1523);
    };

    const getInbox = async() => {
        const config = {
        method: 'GET',
        url: API_END_POINT+'/api/v1/getInbox?owner_reference_number='+storeProfileData[0]?.reference_number+'&email='+storeProfileData[0]?.email,
        headers: { 
          'Content-Type': 'application/json'
        }};
        await axios(config).then((resp) => {
          if(resp){
            console.log(resp?.data?.data);
            storeOnLocalCache(INBOX_KEY,resp?.data?.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    const handleSubmit = (event) => {

        event.preventDefault();

        let formData = {};

        formData.subject = "RE: "+inboxSubject;
        formData.body = inputMessage?.current.value;
        formData.action = "user_reply";
        formData.sender_uuid = userReferenceNumber;
        formData.date_created = formattedDateTime;
        formData.database_id = databaseId;
        formData.table_id= documentId;
        formData.record_id= collectionId;

        setButtonDisabled(!buttonDisabled);

        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });

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
                    setHideReply(hideReply);
                    setInboxSubject("");
                    setInboxBody("");
                    setDatabaseId("");
                    setDocumentId("");
                    setCollectionId("");
                    Notiflix.Notify.info('Successful',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    }); 
                    setTrackDataChange(!trackDataChange); 
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

    if(trackDataChange === true){
        //storeOnLocalCache(INBOX_KEY,inboxData);
    }

    const Export = ({ onExport }) => <button className="me-2 btn btn-outline-dark btn-sm px-3" onClick={e=> onExport(e.target.value)}>
                                       <i className="fas fa-file-excel mx-1"></i>Export data
                                     </button>;
    const Refresh = ({ onRefresh }) => <button className="me-2 btn btn-outline-dark btn-sm px-3" onClick={e=> onRefresh(e.target.value)}>
                                        <i className="fas fa-sync-alt mx-1"></i>Refresh
                                       </button>;

    const handleClick = (e,row) => {
        e.preventDefault();
        setHideReply(!hideReply);
        setInboxSubject(row.subject);
        setInboxBody(row.body);
        setUserReferenceNumber(row.recipient_uuid);
        setDatabaseId(row.$databaseId);
        setDocumentId(row.$id);
        setCollectionId(row.$collectionId);
    };

    const columns = [
        {
            right: false,
            name:  makeTextBold('REPLY MESSAGE',0),
        },   
        {
            name:  makeTextBold('UUID',0),
            selector: row => row.message_uuid,
            sortable: true,
        },    
        {
            name:  makeTextBold('SENDER',0),
            selector: row => row.sender_name,
            sortable: true,
        },
        {
            name:  makeTextBold('MESSAGE',0),
            selector: row => row.body,
            sortable: false,
            right: false,
            wrap: 'yes',
            grow: 2
        },
        {
            name: makeTextBold('DATE',0),
            selector: row => row.date_created.split('T')[0],
            sortable: false,
            right: false,
        },        
        {
            /*
            cell: (row) => <button className="btn btn-outline-success m-2" onClick={(e)=>handleClick(e,row)}>View</button>,
            ignoreRowClick: true,
            allowOverFlow: true,
            button: true
            */
        }        
    ];

    const replyBox = () => {
        return (
            <div className="row">
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <p>Subject: <strong>{inboxSubject}</strong></p>
                        <p><span>{inboxBody}</span></p>
                        <p><textarea className="form-control" id="Message" name="Message" ref={inputMessage} placeholder="Type message..." required /></p>
                        <p style={{textAlign:"end"}}>
                            <button className="my-2 mx-auto btn btn-success" type="submit">
                                Send
                            </button>
                        </p>
                        <p><input type="hidden" className="form-control" id="DatabaseId" name="DatabaseId" defaultValue={databaseId} readOnly /></p>
                        <p><input type="hidden" className="form-control" id="DocumentId" name="DocumentId" defaultValue={documentId}  readOnly /></p>
                        <p><input type="hidden" className="form-control" id="CollectionId" name="CollectionId" defaultValue={collectionId} readOnly /></p>
                    </form>
                </div>
            </div>
        );
    };

    const replyBoxB = (data) => {
        setInboxSubject(data.subject);
        setUserReferenceNumber(data.recipient_uuid);
        return (
            <div className="row">
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <p>Subject: <strong>{data.subject}</strong></p>
                        <p><span style={{color:"darkseagreen"}} >{data.body}</span></p>
                        <p>
                            <textarea 
                                className="form-control" 
                                id="Message" 
                                name="Message"
                                ref={inputMessage} 
                                placeholder="Type message..." 
                                required 
                            />
                        </p>
                        <p style={{textAlign:"left"}}>
                            <button className="my-2 mx-auto btn btn-success" type="submit">
                                Send
                            </button>
                        </p>
                        <p><input type="hidden" className="form-control" id="DatabaseId" name="DatabaseId" defaultValue={data.$databaseId} readOnly /></p>
                        <p><input type="hidden" className="form-control" id="DocumentId" name="DocumentId" defaultValue={data.$id}  readOnly /></p>
                        <p><input type="hidden" className="form-control" id="CollectionId" name="CollectionId" defaultValue={data.$collectionId} readOnly /></p>
                    </form>
                </div>
            </div>
        );
    };

    const subHeaderComponentMemo = React.useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText("");
			}
		};
    
		return (
			<FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
		);
	}, [filterText, resetPaginationToggle]);

    const ExpandedComponent = ({ data }) => {
        return <>{replyBoxB(data)}</>;
    };

    const actionsMemo = React.useMemo(() => <div><Refresh onRefresh={handleRefresh}/></div>, []);

    return  storeProfileData?.length > 0 ? (
        <>
            <div className="container-fluid">
                <div className="row" style={{marginTop:"15px"}}>
                    <div className="content">
                        <table style={{width:"100%"}}>
                            <thead><tr><th/></tr></thead>
                            <tbody>
                                <tr><td><h5><strong>Inbox</strong></h5></td></tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                <tr style={{display: true  ? "" : "none"}}>
                                    <td><h5><strong></strong></h5></td>
                                    <td style={{textAlign:"end"}}>
                                        <button className="btn btn-success m-2" onClick={toggleProfileHide} disabled={storeProfileData[0]?.is_profile_completed === 1 ? false : true}> View</button>
                                    </td>
                                </tr>                    
                                <tr>
                                    <td colSpan={2}>
                                        <table style={{width:"100%",display: hideProfile ? "" :"none"}}>
                                            <thead><tr><th/></tr></thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="bg-white-opacity-40 backdrop-filter backdrop-blur-l px-4 pt-4 pb-6 rounded shadow max-w-[1100px] border border mx-auto">
                                                            <DataTable
                                                                columns={columns}
                                                                style={datatableStyle}
                                                                data={filteredItems}
                                                                pagination
                                                                paginationResetDefaultPage={resetPaginationToggle} 
                                                                subHeader
                                                                subHeaderComponent={subHeaderComponentMemo}
                                                                highlightOnHover
                                                                pointerOnHover
                                                                expandableRows 
                                                                expandableRowsComponent={ExpandedComponent}
                                                                striped
                                                                actions={actionsMemo}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr style={{display: hideReply ? "" : "none"}}><td colSpan={2}>{replyBox()}</td></tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                            </tbody>
                        </table>          
                    </div>
                </div>
            </div>
        </>
    ):<></>;
};

export default InboxPage;
