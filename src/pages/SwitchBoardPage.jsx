import React from "react";
import {NavLink} from 'react-router-dom';

import { Footer, Navbar } from "../components";

const PricingFarmerPage = () => {

  return (
    <>
      <Navbar />
        <div className="container my-3 py-3" style={{height:"auto"}}>
            <h5 className="text-center">Registration Options</h5>
            <hr />
            <div className="row my-4 h-100">
                <div className="col-md-4 col-lg-12 col-sm-8 mx-auto" style={{marginTop:"5px"}}>
                    <div className="card-deck mb-3 text-center">
                        <div className="card mb-4 box-shadow">
                            <div className="card-header">
                                <h4 className="my-0 fw-normal">Register as Farmer</h4>
                            </div>
                            <div className="card-body">
                                <div className="bg-image rounded" data-mdb-ripple-color="light">
                                    <img className="card-img-top p-5" src="../assets/farm.png" alt= "Farmer stickers created by Stickers - Flaticon" style={{width:"50%"}}/>
                                </div>
                                <NavLink to={"/farmer-pricing"}>
                                    <button type="button" className="btn btn-md btn-block btn-outline-success fw-bold">Sign up</button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="card mb-4 box-shadow">
                            <div className="card-header">
                                <h4 className="my-0 fw-normal">Register as Business</h4>
                            </div>
                            <div className="card-body">
                                <div className="bg-image rounded" data-mdb-ripple-color="light">
                                    <img className="card-img-top p-5" src="../assets/business.png" alt="Credit card payment stickers created by Stickers - Flaticon" style={{width:"50%"}} />
                                </div>
                                <NavLink to={"/business-pricing"}>
                                    <button type="button" className={"btn btn-md btn-block btn-outline-success fw-bold"}>Sign up</button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
       </div>
      <Footer />
    </>
  );
};

export default PricingFarmerPage;
