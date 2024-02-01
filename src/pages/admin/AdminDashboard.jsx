import React ,{useEffect, useState} from 'react'
import { Footer, AdminDashboardNavHeader, AdminDashboardBodySection } from "../../components";
import {useNavigate} from 'react-router-dom';
import { getSession } from '../../session/appSession';
import { PROFILE_SESSION } from '../../session/constant';

const AdminDashboard = () => {

  const navigate = useNavigate();
  const [storeProfileData,setStoreProfileData] = useState([]);
  useEffect(() => {
    const session = getSession(PROFILE_SESSION);
    setStoreProfileData(session);
  },[]);

  if(!storeProfileData){
    navigate('/admin/login');
  }

  return (
    <>
      <AdminDashboardNavHeader />
      <AdminDashboardBodySection />
      <Footer />
    </>
  )
};

export default AdminDashboard