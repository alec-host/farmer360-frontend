import React from "react";
import Skeleton from "react-loading-skeleton";

const PageLoading = () => {
    return (
      <>
        <div className="container-fluid p-0 mt-3 ps-3 pe-3">
            <div className="row mb-2 mb-xl-3">
              <Skeleton height={40} />
            </div>
            <div className="row mt-4">
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={200} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={200} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={200} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={200} />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={100} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={100} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={100} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={100} />
              </div>
            </div> 
            <div className="row mt-4">
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={100} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={100} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={100} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={100} />
              </div>
            </div> 
            <div className="row mt-4">
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={200} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={200} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={200} />
              </div>
              <div className="col-sm-6 col-xl-3">
                <Skeleton height={200} />
              </div>
            </div>               
        </div>
      </>
    );
  };

  export default PageLoading;