import React,{ useState, useEffect, useRef } from "react";
import axios from  'axios';

import DataTable from 'react-data-table-component';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import formattedDateTime from "../../../../utility/format-current-date";

import API_END_POINT from "../../../../endpoint/apiRoute";

import datatableStyle from "../../../../css/datatable.module.css";
import { getSession } from "../../../../session/appSession";
import { PROFILE_SESSION } from "../../../../session/constant";
import FilterComponent from "../../../../components/FilterComponent";
import makeTextBold from "../../../../components/BoldTextComponent";
import downloadCSV from "../../../../utils/downloadCSV";
import ComposeFormComponent from "../../../../components/ComposeFormComponent";

import customCss from "../../../../css/custom.loading.module.css";

import { INBOX_KEY, clearLocalCache, readLocalCache, storeOnLocalCache } from "../../../../db/localSessionData";

const AdminInboxPage = () => {

    const inputMessage = useRef("");
    const [hideDataGrid, setHideDataGrid] = useState(false);
    const [hideReply, setHideReply] = useState(false);
    const [storeProfileData, setStoreProfileData] = useState([]);
    const [storeInboxData, setStoreInboxData] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [filterText, setFilterText] = useState('');

    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const toggleDataGrid = () => {
        setHideDataGrid(!hideDataGrid);
    };

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data){
            setStoreProfileData(stored_data);
        }
        Loading.init({className:customCss.notiflix_loading,});
    },[]);

    useEffect(() => {
        const stored_data = readLocalCache(INBOX_KEY);
        if(stored_data){
            setStoreInboxData(stored_data);
        }
    },[]);

    const handleRefresh = () => {
        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });
        clearLocalCache(INBOX_KEY);
        getInbox(1);
        Loading.remove(1523);
    };

    const getInbox = async(reference_number) => {
        const config = {
        method: 'GET',
        url: API_END_POINT+'/api/v1/adminGetAllInbox?reference_number='+reference_number,
        headers: { 
          'Content-Type': 'application/json'
        }};
        await axios(config).then((resp) => {
          if(resp){
            storeOnLocalCache(INBOX_KEY,resp?.data?.data);
            setStoreInboxData(resp?.data?.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  
    const handleSubmit = (event,data) => {

        event.preventDefault();

        let formData = {};

        setButtonDisabled(!buttonDisabled);

        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });

        formData.subject = "RE: "+data?.data.subject;
        formData.body = inputMessage?.current.value;
        formData.action = "admin";
        formData.recipient_uuid = data?.data.sender_uuid;
        formData.sender_uuid = data?.data.recipient_uuid;
        formData.date_created = formattedDateTime;
        formData.database_id = data?.data.$databaseId;
        formData.table_id= data?.data.$id;
        formData.record_id= data?.data.$collectionId;

        setTimeout(() => {
            console.log(formData);
            httpPost(formData);
        },1000);
    };

    const httpPost = (formData) => {
        fetch(`${API_END_POINT}/api/v1/createNewInbox`,{
            method:'POST',
            body: JSON.stringify(formData),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(async(response) => {
            await response.json().then(data=>{
                if(data?.success){
                    setHideReply(hideReply);
                    Notiflix.Notify.info('Successful',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    });  
                    storeOnLocalCache(INBOX_KEY,data?.data);
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

    const columns = [
        {
            name: makeTextBold('REPLY MESSAGE',0),
            right: false,
        },   
        {
            name: makeTextBold('UUID',0),
            selector: row => row.message_uuid,
            sortable: true,
        },    
        {
            name: makeTextBold('SENDER',0),
            selector: row => row.sender_name,
            sortable: true,
        },
        {
            name: makeTextBold('SUBJECT',0),
            selector: row => row.subject,
            sortable: true,
            wrap: 'yes'
        },        
        {
            name: makeTextBold('MESSAGE',0),
            selector: row => <><i>{row.body}</i></>,
            sortable: false,
            right: false,
            wrap: 'yes',
            grow: 3
        },
        {
            name: makeTextBold('DATE',0),
            selector: row => row.date_created.split('T')[0],
            sortable: false,
            right: false,
        },        
    ];

    const Export = ({ onExport }) => <button className="me-2 btn btn-outline-dark btn-sm px-3" onClick={e=> onExport(e.target.value)}>
                                        <i className="fas fa-file-excel mx-1"></i>Export data
                                     </button>;
    const Refresh = ({ onRefresh }) => <button className="me-2 btn btn-outline-dark btn-sm px-3" onClick={e=> onRefresh(e.target.value)}>
                                        <i className="fas fa-sync-alt mx-1"></i>Refresh
                                       </button>;

    const ComposeBox = (data) => {
        return (
            <div className="row">
                <div className="card py-3">
                    <form onSubmit={(e)=>{handleSubmit(e,data)}}>
                        <p style={{fontSize:"12px"}}>Subject: <strong>{data?.data.subject}</strong></p>
                        <p><span style={{color:"darkseagreen"}} >{data?.data.body}</span></p>
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
                        <p><input type="hidden" className="form-control" id="DatabaseId" name="DatabaseId" defaultValue={data?.data.$databaseId} readOnly /></p>
                        <p><input type="hidden" className="form-control" id="DocumentId" name="DocumentId" defaultValue={data?.data.$id}  readOnly /></p>
                        <p><input type="hidden" className="form-control" id="CollectionId" name="CollectionId" defaultValue={data?.data.$collectionId} readOnly /></p>
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
        return <><ComposeBox data={data}  /></>;
    };

    const filteredItems = storeInboxData.filter(item =>JSON.stringify(item).toLowerCase().indexOf(filterText.toLowerCase()) !== -1);

    const actionsMemo = React.useMemo(() => <div><Export onExport={() => downloadCSV(filteredItems)} /><Refresh onRefresh={handleRefresh}/></div>, [filteredItems,storeInboxData]);

    return storeProfileData.length > 0 ? (
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
                                        <button className="btn btn-success m-2" onClick={toggleDataGrid} > View</button>
                                    </td>
                                </tr>                    
                                <tr>
                                    <td colSpan={2}>
                                        <table style={{width:"100%",display: hideDataGrid ? "" :"none"}}>
                                            <thead><tr><th/></tr></thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="bg-white-opacity-40 backdrop-filter backdrop-blur-l px-4 pt-4 pb-6 rounded shadow max-w-[1100px] border border mx-auto">
                                                            <ComposeFormComponent />
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
                                <tr><td colSpan={2}><hr /></td></tr>
                            </tbody>
                        </table>          
                    </div>
                </div>
            </div>
        </>
    ):<></>;
};

export default AdminInboxPage;
