import React from "react";
import { Link } from "react-router-dom";

const date = new Date();

const Footer = () => {
  return (
    <>
      <footer className="mb-0 text-left" style={{background:'#28A745',height:"50vh"}}>
        <div className="d-flex align-items-center justify-content-center pb-5">
          <div className="col-md-8 py-3">
          <div className="row align-items-end"> 
            <div className="col-sm-7">
            </div>
            <div className="col-sm">
              <span className="fw-bolder"></span>
              <ul className="list">
                <li className="list-group-item fw-bolder small">Console</li>
                <li className="list-group-item"><Link to="/admin/login" className="text-decoration-none text-light text-info small">Admin Login</Link></li>
                <li className="list-group-item">&nbsp;</li>
              </ul>
            </div>
            <div className="col-sm">
              <ul className="list">
                <li className="list-group-item fw-bolder small">Legal</li>
                <li className="list-group-item"><Link to="#" className="text-decoration-none text-light text-info small">Privacy Policy</Link></li>
                <li className="list-group-item"><Link to="#" className="text-decoration-none text-light text-info small">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <hr className="text-light"/>
            <div className="row">
              <div className="col-md-4 text-light small">&copy;{" "}{ date.getFullYear() }{" "}GrowAgric{" "}All rights reserved.</div>
              <div className="col-md-8 text-right">
                <a className="text-light fs-4 mx-1" href="/#" target="_blank" rel="noreferrer">
                  { <i className="fab fa-facebook"></i> }
                </a>
                <a className="text-light fs-4 mx-1" href="/#" target="_blank" rel="noreferrer">
                  { <i className="fab fa-instagram"></i> }
                </a>
                <a className="text-light fs-4 mx-1" href="/#" target="_blank" rel="noreferrer">
                  { <i className="fab fa-twitter"></i> }
                </a>
                <a className="text-light fs-4 mx-1" href="/#" target="_blank" rel="noreferrer">
                  { <i className="fab fa-linkedin"></i> }
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
