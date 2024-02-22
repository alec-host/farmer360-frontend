import React ,{useEffect,useState} from 'react'
import { Footer, DashboardNavHeader, DashboardBodySection } from "../components";
import {useNavigate} from 'react-router-dom';

import { getSession } from '../session/appSession';
import { PROFILE_SESSION } from '../session/constant';

const Dashboard = () => {

  const navigate = useNavigate();
  const [storeProfileData,setStoreProfileData] = useState([]);
  useEffect(() => {
    const session = getSession(PROFILE_SESSION);
    setStoreProfileData(session);
  },[]);

  if(!storeProfileData){
    navigate('/login');
  }
  
  return setStoreProfileData?.length > 0 ? (
    <>
      <DashboardNavHeader />
        <DashboardBodySection />
      <Footer />
    </>
  ):navigate('/')
};

export default Dashboard