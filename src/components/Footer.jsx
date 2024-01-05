import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="mb-0 text-center">
        <div className="d-flex align-items-center justify-content-center pb-5">
          <div className="col-md-8">
          <hr/>
            <p className="mb-3 mb-md-0">
              <a href="/#" className="text-decoration-underline text-dark fs-10" target="_blank" rel="noreferrer"><small>GrowAgric</small></a>{" "}
              <small>&copy;</small> {" "}
              <small>2023</small>
            </p>
            <a className="text-dark fs-4" href="/#" target="_blank" rel="noreferrer">
            {<i className="fa fa-facebook"></i> }
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
