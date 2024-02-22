import React,{ useState, useEffect } from "react";
import axios from  'axios';

import DataTable from 'react-data-table-component';

import Notiflix from 'notiflix';
import { Loading } from 'notiflix/build/notiflix-loading-aio';

import formattedDateTime from "../../../../utility/format-current-date";

import API_END_POINT from "../../../../endpoint/apiRoute";

import datatableStyle from "../../../../css/datatable.module.css";
import { getSession } from "../../../../session/appSession";
import { PROFILE_SESSION } from "../../../../session/constant";
import { FARMER_LIMITED_SCOPE_KEY, readLocalCache, storeOnLocalCache } from "../../../../db/localSessionData";
import FilterComponent from "../../../../components/FilterComponent";
import downloadCSV from "../../../../utils/downloadCSV";
import makeTextBold from "../../../../components/BoldTextComponent";

import customCss from "../../../../css/custom.loading.module.css";

const AdminFarmerPage = () => {

    const [hideDataGrid,setHideDataGrid] = useState(false);
    const [storeProfileData, setStoreProfileData] = useState([]);
    const [storeFarmerData, setStoreFarmerData] = useState([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const toggleDataGridHide = () => {
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
        const stored_data = readLocalCache(FARMER_LIMITED_SCOPE_KEY);
        if(stored_data){
            setStoreFarmerData(stored_data);
        }
    },[]);

    const filteredItems = storeFarmerData.filter(
        item =>
          JSON.stringify(item)
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1
    );

    const handleRefresh = () => {
        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });
        getFarmerList(1);
        Loading.remove(1523);
    };

    const getFarmerList = async(reference_number) => {
        const config = {
        method: 'GET',
        url: API_END_POINT+'/api/v1/adminGetFarmersLimitedScope?email=admin&reference_number='+reference_number,
        headers: { 
          'Content-Type': 'application/json'
        }};
        await axios(config).then((resp) => {
          if(resp){
            storeOnLocalCache(FARMER_LIMITED_SCOPE_KEY,resp?.data?.data);
            setStoreFarmerData(resp?.data?.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    const handleSubmit = (event,row) => {

        event.preventDefault();

        let formData = {};

        formData.user_type = "farmer";
        formData.is_suspended = row.is_suspended === 0 ? 1 : 0;
        formData.reference_number = row.value;
        formData.date_created = formattedDateTime;
        formData.database_id = row.$databaseId;
        formData.table_id = row.$collectionId;
        formData.record_id = row.$id;

        setButtonDisabled(!buttonDisabled);

        Loading.standard({
            backgroundColor: 'rgba(0,0,0,0)',
        });
        
        fetch(`${API_END_POINT}/api/v1/adminSuspendUserAccount`,{
            method:'PATCH',
            body: JSON.stringify(formData),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(async(response) => {
            await response.json().then(data=>{
                console.log(data);
                if(data?.success){
                    Notiflix.Notify.info('Successful',{
                        ID:'SWA',
                        timeout:2950,
                        showOnlyTheLastOne:true                      
                    }); 

                    storeOnLocalCache(FARMER_LIMITED_SCOPE_KEY,data?.data); 
                    
                    setTimeout(() => {
                        //window.location.reload();
                    }, 2000);                
                }else{
                    Notiflix.Notify.warning('Operation has Failed',{
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
            Loading.remove(1523);
            console.error(await error);
        });
    };

    const handleClick = (e,row) => {
        e.preventDefault();
        handleSubmit(e,row);
        console.log(row);
    };

    const columns = [   
        {
            name: makeTextBold('UUID'),
            selector: row => row.$id,
            sortable: true,
        },    
        {
            name: makeTextBold('FULL NAME'),
            selector: row => row.name,
            sortable: true,
            grow: 2
        },
        {
            name: makeTextBold('EMAIL'),
            selector: row => row.email,
            sortable: true,
        },
        {
            name: makeTextBold('COUNTRY'),
            selector: row => row.country,
            sortable: true,
        },
        {
            name: makeTextBold('SUBSCRPTION'),
            selector: row => row.subscription,
            sortable: true,
        },        
        {
            name: makeTextBold('DATE'),
            selector: row => row.date_created?.split('T')[0],
            sortable: true,
            right: false,
        }, 
        {
            name: makeTextBold('FLAG'),
            selector: row => row.is_suspended,
            sortable: false,
            right: false,
            hide: true
        },        
        {
            cell: (row) => <><button className={row.is_suspended === 0 ? "btn btn-outline-danger btn-sm m-2" : "btn btn-outline-success btn-sm m-2"} onClick={(e)=>handleClick(e,row)}>{row.is_suspended === 0 ? "Suspend" : "Unsuspend"}</button></>,
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

    const actionsMemo = React.useMemo(() => <div><Export onExport={() => downloadCSV(filteredItems,filteredItems)} /><Refresh onRefresh={handleRefresh}/></div>, [filteredItems,storeFarmerData]);

    return storeProfileData?.length > 0? (
        <>
            <div className="container-fluid">
                <div className="row" style={{marginTop:"15px"}}>
                    <div className="content">
                        <table style={{width:"100%"}}>
                            <thead><tr><th/></tr></thead>
                            <tbody>
                                <tr><td><h5><strong>Farmers</strong></h5></td></tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                <tr style={{display: true  ? "" : "none"}}>
                                    <td><h5><strong></strong></h5></td>
                                    <td style={{textAlign:"end"}}>
                                        <button className="btn btn-success m-2" onClick={toggleDataGridHide} > View </button>
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

export default AdminFarmerPage;
