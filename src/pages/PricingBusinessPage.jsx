import React from "react";
import { Footer, Navbar } from "../components";
import { NavLink } from "react-router-dom";
const PricingBusinessPage = () => {
  return (
    <>
      <Navbar />
        <div className="container my-3 py-3" style={{height:"auto"}}>
            <h5 className="text-center">Business Account Plans</h5>
            <hr />
            <div className="row my-4 h-100">
                <div className="col-md-4 col-lg-12 col-sm-8 mx-auto" style={{marginTop:"5px"}}>
                    <div className="card-deck mb-3 text-center">                     
                        <div className="card mb-4 box-shadow">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Basic</h4>
                            </div>
                            <div className="card-body">
                                <h1 className="card-title pricing-card-title">$0 <small className="text-muted">/ month</small></h1>
                                <ul className="list-unstyled mt-3 mb-4">
                                <li>5 free profles/month</li>
                                <li>Contact farmer <i className="fa fa-multiply mr-1" style={{color:"#EA4335"}}></i></li>
                                <li>Detailed insight <i className="fa fa-multiply mr-1" style={{color:"#EA4335"}}></i></li>
                                <li>Notes and tagging <i className="fa fa-multiply mr-1" style={{color:"#EA4335"}}></i></li>
                                <li>Unlimited countries <i className="fa fa-multiply mr-1" style={{color:"#EA4335"}}></i></li>
                                <li>Exports <i className="fa fa-multiply mr-1" style={{color:"#EA4335"}}></i></li>
                                <li>API integration(additional cost) <i className="fa fa-multiply mr-1" style={{color:"#EA4335"}}></i></li>
                                <li>Free survey request/year limited 200 farmers <i className="fa fa-multiply mr-1" style={{color:"#EA4335"}}></i></li>
                                </ul>
                                <br/>
                                <NavLink to={"/register/business/?subscription=free&t=business&&fee=0"}>
                                    <button type="button" className="btn btn-md btn-block btn-outline-success font-weight-bold">Sign up for Free</button>
                                </NavLink>                                
                            </div>
                        </div>
                        <div className="card mb-4 box-shadow">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Standard</h4>
                            </div>
                            <div className="card-body">
                                <h1 className="card-title pricing-card-title">$65 <small className="text-muted">/ month</small></h1>
                                <ul className="list-unstyled mt-3 mb-4">
                                <li>Unlimited farmer profile <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Contact farmer <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Detailed insight <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Notes and tagging <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Unlimited countries: Limited to 2 countries</li>
                                <li>Exports <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>API integration(additional cost) <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Free survey request/year limited to 200 farmers: Additional cost</li>
                                </ul>
                                <NavLink to={"/register/business/?subscription=basic&t=business&&fee=$65"}>
                                    <button type="button" className="btn btn-md btn-block btn-success font-weight-bold">Get Started</button>
                                </NavLink>  
                            </div>
                        </div>
                        <div className="card mb-4 box-shadow">
                            <div className="card-header">
                                <h4 className="my-0 font-weight-normal">Advance</h4>
                            </div>
                            <div className="card-body">
                                <h1 className="card-title pricing-card-title">$150 <small className="text-muted">/ month</small></h1>
                                <ul className="list-unstyled mt-3 mb-4">
                                <li>Unlimited farmer profile <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Contact farmer <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Detailed insight <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Notes and tagging <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Unlimited countries: Unlimited <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Exports <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>API integration(additional cost) <i className="fa fa-check mr-1" style={{color:"#FFA600"}}></i></li>
                                <li>Free survey request/year limited to 200 farmers: Additional cost</li>
                                </ul>
                                <NavLink to={"/register/business/?subscription=advance&t=business&&fee=$150"}>
                                    <button type="button" className="btn btn-md btn-block btn-success font-weight-bold">Get Started</button>
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

export default PricingBusinessPage;
