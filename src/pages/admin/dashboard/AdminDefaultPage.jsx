import React, { useEffect, useState } from "react";
import axios from  'axios';

import Select from "react-select";

import { Loading } from 'notiflix/build/notiflix-loading-aio';

import DashboardHeadSection from "../../../components/AdminDashboardStatsHeader";

import { getSession } from "../../../session/appSession";
import { PROFILE_SESSION } from "../../../session/constant";
import API_END_POINT from "../../../endpoint/apiRoute";

import BarGraph from "../../../components/BarGraph";
import PageLoading from "../../../components/loader/AdminDefaultPageLoader";
import getCumulativeCounts from "../../../utility/cumulative-count-date";
import { stat_options } from "../../../db/optionsData";
import { BASIC_STAT_KEY, RANGE_STAT_API_KEY, RANGE_STAT_BUSINESS_KEY, RANGE_STAT_COMMENT_KEY, RANGE_STAT_FARMER_KEY, RANGE_STAT_STORY_KEY, RANGE_STAT_SURVEY_KEY, clearLocalCache, readLocalCache, storeOnLocalCache } from "../../../db/localSessionData";
import AdminSurveyRequestPage from "./request/AdminSurveyRequestpage";
import AdminApiRequestPage from "./request/AdminApiRequestPage";
import AdminBlockedStoryPage from "./story-comment/AdminBlockedStoryPage";
import AdminBlockedCommentPage from "./story-comment/AdminBlockedCommentPage";
import AdminFarmerPage from "./registered-users/AdminFarmerPage";
import AdminBusinessPage from "./registered-users/AdminBusinessPage";

const AdminDefaultPage = () => {

  const [loading, setLoading] = useState(false);
  const [storeProfileData, setStoreProfileData] = useState([]);
  const [storeBasicStatData, setStoreBasicStatData] = useState([]);
  const [selectedDateRange, setSelectedDateRange] = useState({startDate: null,endDate: null,});
  const [chartDataSet,setChartDataSet] = useState([]);
  const [visitedPage,setVisitedPage] = useState(null);

  const [storeRangeObject,setStoreRangeObject] = useState({farmer_obj:null,business_obj:null,story_obj:null,comment_obj:null,api_obj:null,survey_obj:null});
  const [storeRangeCount,setStoreRangeCount] = useState({farmer_count:0,business_count:0,story_count:0,comment_count:0,api_count:0,survey_count:0});

  const awesomeIconTheme = {
    color: '#F97316',
    fontSize: '18px',
  };

  useEffect(() => {
    const stored_data = getSession(PROFILE_SESSION);
    if(stored_data){
        setStoreProfileData(stored_data);
    }
    getBasicStats();
    getRangeStats();
  },[]);

  const getBasicStats = async() => {
      setLoading(!loading);
      const config = {
      method: 'GET',
      url: API_END_POINT+'/api/v1/adminGetStats?reference_number=1',
      headers: { 
        'Content-Type': 'application/json'
      }};
      await axios(config).then((resp) => {
        if(resp){
          console.log(resp?.data?.data);
          storeOnLocalCache(BASIC_STAT_KEY,resp?.data?.data);
          setStoreBasicStatData(resp?.data?.data);
          setLoading(loading);
        }
      })
      .catch(function (error) {
        setLoading(loading);
        console.log(error);
      });
  };

  const getRangeStats = () => {

    const endpoint1 = API_END_POINT+'/api/v1/adminGetRangeStats?reference_number=1&stat=farmer';
    const endpoint2 = API_END_POINT+'/api/v1/adminGetRangeStats?reference_number=1&stat=business';
    const endpoint3 = API_END_POINT+'/api/v1/adminGetRangeStats?reference_number=1&stat=story';
    const endpoint4 = API_END_POINT+'/api/v1/adminGetRangeStats?reference_number=1&stat=comment';
    const endpoint5 = API_END_POINT+'/api/v1/adminGetRangeStats?reference_number=1&stat=api';
    const endpoint6 = API_END_POINT+'/api/v1/adminGetRangeStats?reference_number=1&stat=survey';

    Promise.all([
      axios.get(endpoint1),
      axios.get(endpoint2),
      axios.get(endpoint3),
      axios.get(endpoint4),
      axios.get(endpoint5),
      axios.get(endpoint6),
    ])
      .then((responses) => {
        const response1Data = responses[0].data;
        const response2Data = responses[1].data;
        const response3Data = responses[2].data;
        const response4Data = responses[3].data;
        const response5Data = responses[4].data;
        const response6Data = responses[5].data;

        clearLocalCache(RANGE_STAT_FARMER_KEY);
        storeOnLocalCache(RANGE_STAT_FARMER_KEY,response1Data?.data);

        clearLocalCache(RANGE_STAT_BUSINESS_KEY);
        storeOnLocalCache(RANGE_STAT_BUSINESS_KEY,response2Data?.data);

        clearLocalCache(RANGE_STAT_STORY_KEY);
        storeOnLocalCache(RANGE_STAT_STORY_KEY,response3Data?.data);

        clearLocalCache(RANGE_STAT_COMMENT_KEY);
        storeOnLocalCache(RANGE_STAT_COMMENT_KEY,response4Data?.data);

        clearLocalCache(RANGE_STAT_API_KEY);
        storeOnLocalCache(RANGE_STAT_API_KEY,response5Data?.data);

        clearLocalCache(RANGE_STAT_SURVEY_KEY);
        storeOnLocalCache(RANGE_STAT_SURVEY_KEY,response6Data?.data);

        const stored_farmer_data = readLocalCache(RANGE_STAT_FARMER_KEY);
        if(stored_farmer_data) {
          console.log(stored_farmer_data.length);
          setStoreRangeObject((prev) => ({
            ...prev,
            farmer_obj: stored_farmer_data,
          }));
        }

        const stored_business_data = readLocalCache(RANGE_STAT_BUSINESS_KEY);
        if(stored_business_data) {
          console.log(stored_business_data.length);
          setStoreRangeObject((prev) => ({
            ...prev,
            business_obj: stored_business_data,
          }));
        }

        const stored_story_data = readLocalCache(RANGE_STAT_STORY_KEY);
        if(stored_story_data) {
          console.log(stored_story_data.length);
          setStoreRangeObject((prev) => ({
            ...prev,
            story_obj: stored_story_data,
          }));          
        }
        
        const stored_comment_data = readLocalCache(RANGE_STAT_COMMENT_KEY);
        if(stored_comment_data) {
          console.log(stored_comment_data.length);
          setStoreRangeObject((prev) => ({
            ...prev,
            comment_obj: stored_comment_data,
          }));
        }  
        
        const stored_api_data = readLocalCache(RANGE_STAT_API_KEY);
        if(stored_api_data) {
          console.log(stored_api_data.length);
          setStoreRangeObject((prev) => ({
            ...prev,
            api_obj: stored_api_data,
          }));
        } 

        const stored_survey_data = readLocalCache(RANGE_STAT_SURVEY_KEY);
        if(stored_survey_data) {
          console.log(stored_survey_data.length);
          setStoreRangeObject((prev) => ({
            ...prev,
            survey_obj: stored_survey_data,
          }));
        } 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleDateRangeChange = (dateRange) => {
    setSelectedDateRange(dateRange);
  };

  const handleRefresh = () => {
    Loading.standard({
        backgroundColor: 'rgba(0,0,0,0)',
    });
    clearLocalCache(BASIC_STAT_KEY);
    getBasicStats();
    getRangeStats();
    Loading.remove(1523);
  };

  const handleSubmit = () => {
  };

  const handleOnClick = () => {
    if(selectedDateRange.startDate && selectedDateRange.endDate){

      const startDate = typeof(selectedDateRange.startDate.length) === "undefined" ? selectedDateRange.startDate.toISOString().split('T')[0] : selectedDateRange.startDate;
      const endDate = typeof(selectedDateRange.endDate.length) === "undefined" ? selectedDateRange.endDate.toISOString().split('T')[0] : selectedDateRange.endDate;

      const farmerObj = rangeStatCount(startDate,endDate,storeRangeObject.farmer_obj);
      setStoreRangeCount((prev) => ({
        ...prev,
        farmer_count: farmerObj.length,
      }));
      const businessObj = rangeStatCount(startDate,endDate,storeRangeObject.business_obj);
      setStoreRangeCount((prev) => ({
        ...prev,
        business_count: businessObj.length,
      }));
      const storyObj = rangeStatCount(startDate,endDate,storeRangeObject.story_obj);
      setStoreRangeCount((prev) => ({
        ...prev,
        story_count: storyObj.length,
      }));
      const commentObj = rangeStatCount(startDate,endDate,storeRangeObject.comment_obj);
      setStoreRangeCount((prev) => ({
        ...prev,
        comment_count: commentObj.length,
      }));
      const apiObj = rangeStatCount(startDate,endDate,storeRangeObject.api_obj);
      setStoreRangeCount((prev) => ({
        ...prev,
        api_count: apiObj.length,
      }));
      const surveyObj = rangeStatCount(startDate,endDate,storeRangeObject.survey_obj);
      setStoreRangeCount((prev) => ({
        ...prev,
        survey_count: surveyObj.length,
      })); 
    }
  };

  const handleChange = (e) => {
    console.log(storeRangeObject.farmer_obj);
    let count = 0;

    const startDate = typeof(selectedDateRange.startDate.length) === "undefined" ? selectedDateRange.startDate.toISOString().split('T')[0] : selectedDateRange.startDate;
    const endDate = typeof(selectedDateRange.endDate.length) === "undefined" ? selectedDateRange.endDate.toISOString().split('T')[0] : selectedDateRange.endDate;

    switch(parseInt(e.value)){
      case 0:
        count = getCumulativeCounts(storeRangeObject.farmer_obj,startDate,endDate);
      break;
      case 1:
        count = getCumulativeCounts(storeRangeObject.business_obj,startDate,endDate);
      break;
      case 2:
        count = getCumulativeCounts(storeRangeObject.story_obj,startDate,endDate);
      break;
      case 3:
        count = getCumulativeCounts(storeRangeObject.comment_obj,startDate,endDate);
      break;
      case 4:
        count = getCumulativeCounts(storeRangeObject.api_obj,startDate,endDate);
      break;
      case 5:
        count = getCumulativeCounts(storeRangeObject.survey_obj,startDate,endDate);
      break;
      default:break;
    }
    setChartDataSet(count);
    console.log(e.value);
  };

  const rangeStatCount = (startDate,endDate,jsonData) => {
    const filteredData = jsonData.filter((obj) => {
      const objDate = obj.date_created?.split("T")[0];
      return objDate >= startDate && objDate <= endDate;
    });
    return filteredData;
  };

  const DashBoardTitle = () => {
    return(
      <>
        <div className="container-fluid p-0 mt-3 ps-3 pe-3">
          <div className="row mb-2 mb-xl-3">
            <div className="col-auto d-none d-sm-block">
              <h5><strong>Dashboard</strong></h5>
            </div>
          </div>
        </div>
      </>
    );
  };

  const FilterButton = () =>{
    return(
          <>
            <button className="btn btn-outline-dark btn-sm mx-0 px-4" onClick={handleOnClick}><i className="fas fa-filter"></i> Filter</button>
          </>
        );
  };

  const RefreshButton = () =>{
    return(
          <>
            <button className="btn btn-primary btn-sm mx-0 px-3" onClick={handleRefresh}>Refresh</button>
          </>
        );
  };

  const SelectStatOption = () => {
    return(
      <>
          <div>
              <div className="row">
                <div className="col-12-sm">
                  <span className="fw-bold small pb-2">Select options below</span>
                  <Select 
                    onChange={handleChange}
                    options={stat_options}
                    isOptionDisabled={(option) => option.disabled}
                  />
                </div>
              </div>
          </div>
      </>
    );
  };

  const handlePageNavigation = (e) => {
    const buttonOption = e?.target.name;
    if(buttonOption){
      switch(buttonOption.replace("btnView","")){
        case "farmer": setVisitedPage(<AdminFarmerPage />); break;
        case "business": setVisitedPage(<AdminBusinessPage />); break;
        case "api": setVisitedPage(<AdminApiRequestPage />); break;
        case "survey": setVisitedPage(<AdminSurveyRequestPage />); break;
        case "story": setVisitedPage(<AdminBlockedStoryPage />); break;
        case "comment": setVisitedPage(<AdminBlockedCommentPage />); break;
        default:break;
      };
    }
  };

  const buttonViewStats = (buttonOption) => {
    return(
      <div className="text-end py-3">
        <button type="button" name={"btnView"+buttonOption} className="btn btn-outline-secondary btn-sm px-4" data-toggle="modal" data-target="#statModal" onClick={handlePageNavigation}>
        <i className="far fa-eye"></i> View 
        </button>
      </div>
    );
  };

  const ModalViewStatData = () => {
    return(
      <>
        <div className="modal fade" id="statModal" tabIndex={"-1"} role="dialog" aria-labelledby="statModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="statModalLabel"></h5>
                <button type="button" className="close fs-3 me-2" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{visitedPage}</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const DashboardBodySection = () => {
    return (
      <div className="container-fluid p-0 mt-3 ps-3 pe-3">
        <div className="row mt-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">Registered Farmers</h5>
                  </div>

                  <div className="col-auto">
                    <div className="stat text-success">
                      <i className="fas fa-tractor" style={awesomeIconTheme}></i>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col"><h1 className="mt-1 mb-3">{storeBasicStatData?.length > 0 ? storeBasicStatData[0]?.farmer_count : 0}</h1></div>
                  <div className="col">{buttonViewStats("farmer")}<ModalViewStatData pageName={''} /></div>
                </div>
                <div className="mb-0">
                  <span className="badge rounded-pill bg-dark px-5 mx-2"> <i className="mdi mdi-arrow-bottom-right"></i> { storeRangeCount.farmer_count } </span>
                  <span className="text-muted">Range count</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">Registered Businesses</h5>
                  </div>

                  <div className="col-auto">
                    <div className="stat text-primary">
                      <i className="fas fa-user-tie" style={awesomeIconTheme}></i>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col"><h1 className="mt-1 mb-3">{storeBasicStatData?.length > 0 ? storeBasicStatData[0]?.business_count : 0}</h1></div>
                  <div className="col">{buttonViewStats("business")}<ModalViewStatData  pageName={''} /></div>
                </div>
                <div className="mb-0">
                  <span className="badge rounded-pill bg-success px-5 mx-2"> <i className="mdi mdi-arrow-bottom-right"></i> { storeRangeCount.business_count } </span>
                  <span className="text-muted">Range count</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">API Requests</h5>
                  </div>

                  <div className="col-auto">
                    <div className="stat text-primary">
                      <i className="fas fa-database" style={awesomeIconTheme}></i>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col"><h1 className="mt-1 mb-3">{storeBasicStatData?.length > 0 ? storeBasicStatData[0]?.api_count : 0}</h1></div>
                  <div className="col">{buttonViewStats("api")}<ModalViewStatData  pageName={''} /></div>
                </div>
                <div className="mb-0">
                  <span className="badge rounded-pill bg-danger px-5 mx-2"> <i className="mdi mdi-arrow-bottom-right"></i> { storeRangeCount.api_count } </span>
                  <span className="text-muted">Range count</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">Survey Requests</h5>
                  </div>

                  <div className="col-auto">
                    <div className="stat text-primary">
                      <i className="fas fa-poll" style={awesomeIconTheme}></i>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col"><h1 className="mt-1 mb-3">{storeBasicStatData?.length > 0 ? storeBasicStatData[0]?.survey_count : 0}</h1></div>
                  <div className="col">{buttonViewStats("survey")}<ModalViewStatData  pageName={''} /></div>
                </div>
                <div className="mb-0">
                  <span className="badge rounded-pill bg-dark px-5 mx-2"> <i className="mdi mdi-arrow-bottom-right"></i> { storeRangeCount.survey_count } </span>
                  <span className="text-muted">Range count</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                    <h5 className="card-title">Blocked stories</h5>
                  </div>
                  <div className="col-auto">
                    <div className="stat text-primary">
                      <i className="fas fa-comment-alt" style={{color:"#F97316"}}></i>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col"><h1 className="mt-1 mb-3">{storeBasicStatData?.length > 0 ? storeBasicStatData[0]?.story_count : 0}</h1></div>
                  <div className="col">{buttonViewStats("story")}<ModalViewStatData  pageName={''} /></div>
                </div>
                <div className="mb-0">
                  <span className="badge rounded-pill bg-dark px-5 mx-2"> <i className="mdi mdi-arrow-bottom-right"></i> { storeRangeCount.story_count } </span>
                  <span className="text-muted">Range count</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col mt-0">
                      <h5 className="card-title">Blocked comments</h5>
                    </div>
                    <div className="col-auto">
                      <div className="stat text-primary">
                        <i className="fas fa-comments" style={awesomeIconTheme}></i>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col"><h1 className="mt-1 mb-3">{storeBasicStatData?.length > 0 ? storeBasicStatData[0]?.comment_count : 0}</h1></div>
                    <div className="col">{buttonViewStats("comment")}<ModalViewStatData  pageName={''} /></div>
                  </div>
                  <div className="mb-0">
                    <span className="badge rounded-pill bg-dark px-5 mx-2"> <i className="mdi mdi-arrow-bottom-right"></i> { storeRangeCount.comment_count } </span>
                    <span className="text-muted">Range count</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-body">
                  <SelectStatOption />
                  <BarGraph data={chartDataSet} />
                </div>
              </div>
            </div>
          </div>

        </div>
      );
    };

    return (
      <>
        {
          loading ? 
          <PageLoading /> 
          : 
          <>
            <DashBoardTitle />
            <DashboardHeadSection onDateRangeChange={handleDateRangeChange} formSubmitHandle={handleSubmit} injectedFilterButton={<FilterButton />} injectedRefreshButton={<RefreshButton />} /> 
            <DashboardBodySection />
          </>
        }
      </>
    );

};

export default AdminDefaultPage;
