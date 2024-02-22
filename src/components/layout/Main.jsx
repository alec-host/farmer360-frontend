import React from "react";


const Home = () => {
  return (
    <>
      <div className="container shadow min-vh-100 py-4">
        <div className="hero border-1 pb-3 mt-3">
          <div className="row border-0 mx-0">
            <div className="card d-flex align-items-center">
              <div className="container mb-3 pt-2">
                <div className="input-group mt-2">
                    <input type="text" className="form-control border-end-0 border rounded-pill" />
                    <span className="input-group-append">
                        <button className={"btn btn-outline-secondary bg-white border-bottom-0 border rounded-pill"} style={{marginLeft:"-40px"}} type="button">
                          <i className="fa fa-search"></i>
                        </button>
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
