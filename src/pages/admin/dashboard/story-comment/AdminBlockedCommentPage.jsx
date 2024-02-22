import React,{ useState, useEffect, useRef } from "react";
import axios from  'axios';

import DataTable from 'react-data-table-component';

import { Loading } from 'notiflix/build/notiflix-loading-aio';

import API_END_POINT from "../../../../endpoint/apiRoute";

import datatableStyle from "../../../../css/datatable.module.css";
import { getSession } from "../../../../session/appSession";
import { PROFILE_SESSION } from "../../../../session/constant";
import FilterComponent from "../../../../components/FilterComponent";
import makeTextBold from "../../../../components/BoldTextComponent";
import downloadCSV from "../../../../utils/downloadCSV";

import customCss from "../../../../css/custom.loading.module.css";

import { COMMENT_KEY, readLocalCache, storeOnLocalCache } from "../../../../db/localSessionData";


const AdminBlockedCommentPage = () => {

    const [hideDataGrid, setHideDataGrid] = useState(false);
    const [storeProfileData, setStoreProfileData] = useState([]);
    const [storeCommentData, setStoreCommentData] = useState([]);

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
        const stored_data = readLocalCache(COMMENT_KEY);
        if(stored_data){
            setStoreCommentData(stored_data);
        }
    },[]);

    const filteredItems = storeCommentData.filter(
        item =>
          JSON.stringify(item)
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
    );

    const handleRefresh = () => {
        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });
        getComment(1);
        Loading.remove(1523);
    };

    const getComment = async(reference_number) => {
        const config = {
        method: 'GET',
        url: API_END_POINT+'/api/v1/adminGetAllComments?reference_number='+reference_number,
        headers: { 
          'Content-Type': 'application/json'
        }};
        await axios(config).then((resp) => {
          if(resp){
            storeOnLocalCache(COMMENT_KEY,resp?.data?.data);
            setStoreCommentData(resp?.data?.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    const columns = [  
        {
            name: makeTextBold('UUID',0),
            selector: row => row.comment_uuid,
            sortable: true,
        },    
        {
            name: makeTextBold('NAME',0),
            selector: row => row.commenters_name,
            sortable: true,
        },        
        {
            name: makeTextBold('COMMENT',0),
            selector: row => <><i>{row.comment}</i></>,
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
        {
            cell: (row) => <button className="btn btn-outline-success btn-sm m-2">View</button>,
            ignoreRowClick: true,
            allowOverFlow: true,
            button: true
        }        
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

    const actionsMemo = React.useMemo(() => <div><Export onExport={() => downloadCSV(filteredItems,filteredItems)} /><Refresh onRefresh={handleRefresh}/></div>, [filteredItems,storeCommentData]);

    return storeProfileData?.length > 0 ? (
        <>
            <div className="container-fluid">
                <div className="row" style={{marginTop:"15px"}}>
                    <div className="content">
                        <table style={{width:"100%"}}>
                            <thead><tr><th/></tr></thead>
                            <tbody>
                                <tr><td><h5><strong>Blocked Comments</strong></h5></td></tr>
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

export default AdminBlockedCommentPage;
