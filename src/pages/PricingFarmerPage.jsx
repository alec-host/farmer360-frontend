import React from "react";
import {NavLink} from 'react-router-dom';

import { Footer, Navbar } from "../components";
const PricingFarmerPage = () => {

  return (
    <>
      <Navbar />
        <div className="container my-3 py-3">
            <h5 className="text-center">Pricing</h5>
            <hr />
            <div className="row my-4 h-100">
                <div className="col-md-4 col-lg-12 col-sm-8 mx-auto" style={{marginTop:"5px"}}>
                    <div className="card-deck mb-3 text-center">
                        <div className="card mb-4 box-shadow">
                            <div className="card-header" style={{color:"#198754"}}>
                                <h4 className="my-0 font-weight-normal"><strong>FREE</strong></h4>
                            </div>
                            <div className="card-body">
                                <h1 className="card-title pricing-card-title">$0 <small className="text-muted">/ month</small></h1>
                                <ul className="list-unstyled mt-3 mb-4">
                                    <li>Setup profile <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                    <li>Contect & share stories <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                    <li>Earn from survey participation <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                    <li>Widthdraw from shop/wallet <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                    <li>Marketing <i className="fa fa-multiply mr-1" style={{color:"#EA4335"}}></i></li>
                                    <li>Sell items <i className="fa fa-multiply mr-1" style={{color:"#EA4335"}}></i></li>
                                    <li>24/7 support <i className="fa fa-multiply mr-1" style={{color:"#EA4335"}}></i></li>
                                </ul>
                                <NavLink to={"/register/?subscription=basic"}>
                                    <button type="button" className="btn btn-md btn-block btn-outline-success">Sign up for free</button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="card mb-4 box-shadow">
                            <div className="card-header" style={{color:"#198754"}}>
                                <h4 className="my-0 font-weight-normal"><strong>ADVANCE</strong></h4>
                            </div>
                            <div className="card-body">
                                <h1 className="card-title pricing-card-title">$10 <small className="text-muted">/ month</small></h1>
                                <ul className="list-unstyled mt-3 mb-4">
                                <li>Setup profile <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                    <li>Contect & share stories <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                    <li>Earn from survey participation <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                    <li>Widthdraw from shop/wallet <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                    <li>Marketing <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                    <li>Sell items <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                    <li>24/7 support <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                </ul>
                                <NavLink to={"/register/?subscription=advance"}>
                                    <button type="button" className="btn btn-md btn-block btn-success">Get started</button>
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
