import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AdminDashboardStatsHeader = ({ onDateRangeChange,formSubmitHandle,injectedFilterButton,injectedRefreshButton }) => {

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    onDateRangeChange({
      startDate: date ? date.toISOString().split('T')[0] : null,
      endDate,
    });
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    onDateRangeChange({
      startDate,
      endDate: date ? date.toISOString().split('T')[0] : null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {};

    if(startDate && endDate){
      formData.start_date = startDate.toISOString().split('T')[0];
      formData.end_date = endDate.toISOString().split('T')[0];

      formSubmitHandle(formData);
    }
    
  };
  
  return (
      <>
      <form onSubmit={handleSubmit}>
        <div className="container-fluid p-0 mt-3 ps-3 pe-3">
          <div className="row mb-2 mb-xl-3">
            <div className="col-auto ms-auto text-end mt-n1">
              <div className="row g-1">
                <div className="col">
                  <DatePicker
                    className="form-control form-control-sm"
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Select Start Date"
                  />
                </div>
                <div className="col">
                  <DatePicker
                    className="form-control form-control-sm"
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="Select End Date"
                  />
                </div>
                <div className="col col-md-auto">
                  {injectedFilterButton}
                </div>
                <div className="col col-md-auto">
                  {injectedRefreshButton}
                </div>
              </div>
            </div>
          </div>
        </div> 
      </form>
      </>
    );
  };
  
  export default AdminDashboardStatsHeader;