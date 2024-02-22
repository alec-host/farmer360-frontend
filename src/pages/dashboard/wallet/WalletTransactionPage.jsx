import React,{ useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import axios from 'axios';

import DataTable from 'react-data-table-component';


import { getSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";
import datatableStyle from "../../../css/datatable.module.css";
import API_END_POINT from "../../../endpoint/apiRoute";
import humanReadableDate from "../../../utility/date-human-readable-format";

const WalletTransactionPage = () => {

    const [hideWallet, setHideWallet] = useState(false);
    const [storeProfileData, setStoreProfileData] = useState([]);
    const [storeTransactionData, setStoreTransactionData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [pending, setPending] = React.useState(true);

    const makeTextBold = (value,fontSize) => {
        return (
            
            <>
            {
            fontSize === "small" ?
            <div><strong style={{fontSize:"10px",color:"#198754"}}>{value}</strong></div>
            :
            <div><strong>{value}</strong></div>
            }
            </>
        );
    };

    const columnsData = [  
        {
            id:'date',
            name: makeTextBold('DATE',''),
            selector: row => humanReadableDate(row.date_created),
            left: true,
        },  
        {
            id:'details',
            name: makeTextBold('DETAILS',''),
            selector: row => <i>{row.particulars}</i>,
            wrap: 'yes',
            grow: 3
        },             
        {
            id: 'cr_dr',
            name: makeTextBold('AMOUNT',''),
            selector: row => row.cr === 0 ?  (row.dr) : row.cr,
        },
        {
            id: '_dr_cr',
            name: makeTextBold('MOVEMENT',0),
            selector: row => row.cr === 0 ?  makeTextBold('OUT','small') : makeTextBold('IN','small'),
        },
        {
            id:'running_bal',
            name: makeTextBold('TOTAL',''),
            selector: row => row.running_balance,
            right: true,
        }     
    ];

    const toggleProfileHide = () => {
        setHideWallet(!hideWallet);
    };

    useEffect(() => {
        const stored_data = getSession(PROFILE_SESSION);
        if(stored_data){
            setStoreProfileData(stored_data);
        }
        getWalletTransactions(stored_data[0].reference_number);
    },[]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setColumns(columnsData);
            setPending(false);
        },2000);
        return () => clearTimeout(timeout);
    },[columns]);

    const getWalletTransactions = async(reference_number) => {
        try{
          if(typeof(reference_number) !== 'undefined'){

            const url = `${API_END_POINT}/api/v1/getWalletTransaction?owner_reference_number=${reference_number}`;
          
            const response = await axios.get(url);
            const newData = response?.data?.data;

            setStoreTransactionData(newData);
          }
        }catch(error){
          setPending(true);  
          console.error('Error fetching data:', error);
        }
      };

    const CustomNoDataComponent = () => (
    <div style={{ textAlign: 'center'}}>
        <h2 style={{fontSize:'14px'}}>{storeTransactionData && storeTransactionData.length > 0 ? "Please wait..." : "There are no records to display"}</h2>
    </div>
    );

    return storeProfileData?.length > 0 ? (
        <>
            <div className="container-fluid">
                <div className="container" style={{marginTop:"15px"}}>
                    <div className="row">
                            <table style={{width:"100%"}}>
                                <thead><tr><th/></tr></thead>
                                <tbody>
                                    <tr><td><h5><strong>Wallet Transaction</strong></h5></td></tr>
                                    <tr><td colSpan={2}><hr /></td></tr>
                                    <tr style={{display: storeProfileData[0]?.account_type === "farmer" || storeProfileData[0]?.account_type === "business" ? "" : "none"}}>
                                        <td><h5><strong></strong></h5></td>
                                        <td style={{textAlign:"end"}}>
                                            <NavLink to="#" className="btn btn-outline-success m-2" onClick={toggleProfileHide}><i className="" ></i>  View</NavLink>
                                        </td>
                                    </tr>                     
                                    <tr>
                                        <td colSpan={2}>
                                            <table style={{width:"100%",display: hideWallet ? "" :"none"}}>
                                                <thead><tr><th/></tr></thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <DataTable
                                                                columns={columns}
                                                                style={datatableStyle}
                                                                data={storeTransactionData}
                                                                noDataComponent={<CustomNoDataComponent />}
                                                                progressPending={pending}
                                                                pagination
                                                                highlightOnHover
                                                                pointerOnHover
                                                                striped
                                                            />
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

export default WalletTransactionPage;
