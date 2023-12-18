import React ,{useEffect,useState} from 'react'
import { Footer, DashboardNavHeader, DashboardBodySection } from "../components";
import {useNavigate} from 'react-router-dom';
import { PROFILE_KEY, readLocalCache } from '../db/localSessionData';

const Dashboard = () => {
  const navigate = useNavigate();
  const [storeData,setStoreData] = useState([]);

  useEffect(() => {
    const stored_data = readLocalCache(PROFILE_KEY);
    setStoreData(stored_data);
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