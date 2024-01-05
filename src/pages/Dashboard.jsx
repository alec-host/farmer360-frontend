import React ,{useEffect,useState} from 'react'
import { Footer, DashboardNavHeader, DashboardBodySection } from "../components";
import {useNavigate} from 'react-router-dom';

import { getSession } from '../session/appSession';
import { PROFILE_SESSION } from '../session/constant';

const Dashboard = () => {

  const navigate = useNavigate();
  const [storeData,setStoreData] = useState([]);
  useEffect(() => {
    const session = getSession(PROFILE_SESSION);
    setStoreData(session);
  },[]);

  if(!storeData){
    navigate('/login');
  }

  return (
    <>
      <DashboardNavHeader />
      <DashboardBodySection />
      <Footer />
    </>
  )
};

export default Dashboard