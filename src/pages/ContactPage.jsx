import React from "react";
import { Footer, Navbar } from "../components";

import buttonStyle from "../css/custom.button.module.css";

const ContactPage = () => {
  return (
    <>
      <Navbar />
      <div className="container my-3 py-3" style={{height:"100vh"}}>
        <h5 className="text-center">Contact Us</h5>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form>
              <div className="my-3">
                <label htmlFor="Name" className="form-label text-black-50 m-0 small">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="Name"
                  placeholder="Enter your name"
                  maxLength={50}
                />
              </div>
              <div className="my-3">
                <label htmlFor="Email" className="form-label text-black-50 m-0 small">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="Email"
                  placeholder="name@example.com"
                  maxLength={30}
                />
              </div>
              <div className="my-3">
                <label htmlFor="Password" className="form-label text-black-50 m-0 small">Message</label>
                <textarea
                  rows={5}
                  className="form-control"
                  id="Password"
                  placeholder="Enter your message"
                  maxLength={450}
                />
              </div>
              <div className="text-right">
                <button className={"my-2 px-4 mx-auto fw-bold btn "+buttonStyle.custom_theme_button} type="submit" disabled>
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
