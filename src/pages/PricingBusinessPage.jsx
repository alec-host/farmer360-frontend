import React from "react";
import { Footer, Navbar } from "../components";
const PricingBusinessPage = () => {
  return (
    <>
      <Navbar />
        <div className="container my-3 py-3">
            <h5 className="text-center">Pricing</h5>
            <hr />
            <div class="row my-4 h-100">
                <div className="col-md-4 col-lg-12 col-sm-8 mx-auto" style={{marginTop:"5px"}}>
                    <div class="card-deck mb-3 text-center">
                        <div class="card mb-4 box-shadow">
                            <div class="card-header">
                                <h4 class="my-0 font-weight-normal">Free</h4>
                            </div>
                            <div class="card-body">
                                <h1 class="card-title pricing-card-title">$0 <small class="text-muted">/ month</small></h1>
                                <ul class="list-unstyled mt-3 mb-4">
                                <li>Unlimited farmer profile: Limited to 5 profles/month</li>
                                <li>Contact farmer: NO</li>
                                <li>Detailed insight: NO</li>
                                <li>Notes and tagging: NO</li>
                                <li>Unlimited countries: NO</li>
                                <li>Exports: NO</li>
                                <li>API integration(additional cost): NO</li>
                                <li>Free survey request/year limited 200 farmers: NO</li>
                                </ul>
                                <button type="button" class="btn btn-lg btn-block btn-outline-primary">Sign up for free</button>
                            </div>
                        </div>
                        <div class="card mb-4 box-shadow">
                            <div class="card-header">
                                <h4 class="my-0 font-weight-normal">Standard</h4>
                            </div>
                            <div class="card-body">
                                <h1 class="card-title pricing-card-title">$65 <small class="text-muted">/ month</small></h1>
                                <ul class="list-unstyled mt-3 mb-4">
                                <li>Unlimited farmer profile: YES</li>
                                <li>Contact farmer: YES</li>
                                <li>Detailed insight: YES</li>
                                <li>Notes and tagging: YES</li>
                                <li>Unlimited countries: Limited to 2 countries</li>
                                <li>Exports: YES</li>
                                <li>API integration(additional cost): NO</li>
                                <li>Free survey request/year limited to 200 farmers: Additional cost</li>
                                </ul>
                                <button type="button" class="btn btn-lg btn-block btn-primary">Get started</button>
                            </div>
                        </div>
                        <div class="card mb-4 box-shadow">
                            <div class="card-header">
                                <h4 class="my-0 font-weight-normal">Advance</h4>
                            </div>
                            <div class="card-body">
                                <h1 class="card-title pricing-card-title">$150 <small class="text-muted">/ month</small></h1>
                                <ul class="list-unstyled mt-3 mb-4">
                                <li>Unlimited farmer profile: YES</li>
                                <li>Contact farmer: YES</li>
                                <li>Detailed insight: YES</li>
                                <li>Notes and tagging: YES</li>
                                <li>Unlimited countries: Limited: YES</li>
                                <li>Exports: YES</li>
                                <li>API integration(additional cost): YES</li>
                                <li>Free survey request/year limited to 200 farmers: Additional cost</li>
                                </ul>
                                <button type="button" class="btn btn-lg btn-block btn-primary">Contact us</button>
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
