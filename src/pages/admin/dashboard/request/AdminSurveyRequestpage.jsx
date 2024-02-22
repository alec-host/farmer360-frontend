import React,{ useState, useEffect, useRef } from "react";
import axios from  'axios';

import DataTable from 'react-data-table-component';

import { Loading } from 'notiflix/build/notiflix-loading-aio';

import API_END_POINT from "../../../../endpoint/apiRoute";

import datatableStyle from "../../../../css/datatable.module.css";
import { getSession } from "../../../../session/appSession";
import { PROFILE_SESSION } from "../../../../session/constant";
import { SURVEY_REQUEST_KEY, readLocalCache, storeOnLocalCache } from "../../../../db/localSessionData";
import FilterComponent from "../../../../components/FilterComponent";
import downloadCSV from "../../../../utils/downloadCSV";
import makeTextBold from "../../../../components/BoldTextComponent";
import customCss from "../../../../css/custom.loading.module.css";

const AdminSurveyRequestPage = () => {

    const [hideProfile, setHideProfile] = useState(false);
    const [storeProfileData, setStoreProfileData] = useState([]);
    const [storeRequestData, setStoreRequestData] = useState([]);

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
        Loading.init({className:customCss.notiflix_loading,});
    },[]);

    useEffect(() => {
        const stored_data = readLocalCache(SURVEY_REQUEST_KEY);
        if(stored_data){
            setStoreRequestData(stored_data);
        }
    },[]);

    const filteredItems = storeRequestData.filter(
        item =>
          JSON.stringify(item)
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
    );

    const handleRefresh = () => {
        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });
        getSurveyServiceRequest(1);
        Loading.remove(1523);
    };

    const getSurveyServiceRequest = async(reference_number) => {
        const config = {
        method: 'GET',
        url: API_END_POINT+'/api/v1/adminGetAllServiceRequests?request_type=survey&reference_number='+reference_number,
        headers: { 
          'Content-Type': 'application/json'
        }};
        await axios(config).then((resp) => {
          if(resp){
            storeOnLocalCache(SURVEY_REQUEST_KEY,resp?.data?.data);
            setStoreRequestData(resp?.data?.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    const columns = [  
        /* 
        {
            name: makeTextBold('UUID'),
            selector: row => row.request_uuid,
            sortable: true,
        },
        */    
        {
            name: makeTextBold('BUSINESS NAME'),
            selector: row => row.business_name,
            sortable: true,
        },
        {
            name: makeTextBold('SURVEY TITLE'),
            selector: row => row.survey_title,
            sortable: true,
        },        
        {
            name: makeTextBold('PURPOSE/OBJECTIVE'),
            selector: row => <><i>{row.survey_objective}</i></>,
            sortable: false,
            right: false,
            wrap: 'yes',
            grow: 2,
        },
        {
            name: makeTextBold('TARGET AUDIENCE'),
            selector: row => <><i>{row.target_audience}</i></>,
            sortable: true,
            allowOverflow: false,
            wrap: 'yes',
            grow: 2,
        },
        {
            name: makeTextBold('NO. OF PARTICIPANTS'),
            selector: row => row.number_of_participants,
            sortable: true,
        },
        {
            name: makeTextBold('DATE'),
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

    const actionsMemo = React.useMemo(() => <div><Export onExport={() => downloadCSV(filteredItems,filteredItems)} /><Refresh onRefresh={handleRefresh}/></div>, [filteredItems,storeRequestData]);

    return storeProfileData?.length > 0 ? (
        <>
            <div className="container-fluid">
                <div className="row" style={{marginTop:"15px"}}>
                    <div className="content">
                        <table style={{width:"100%"}}>
                            <thead><tr><th/></tr></thead>
                            <tbody>
                                <tr><td><h5><strong>Survey Requests</strong></h5></td></tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                <tr style={{display: true  ? "" : "none"}}>
                                    <td><h5><strong></strong></h5></td>
                                    <td style={{textAlign:"end"}}>
                                        <button className="btn btn-success m-2" onClick={toggleProfileHide}> View</button>
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
                                                                responsive
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

export default AdminSurveyRequestPage;
