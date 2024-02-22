import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from "../../css/nav.module.css";

import buttonStyle from "../../css/custom.button.module.css";

const Navbar = () => {
    const state = useSelector(state => state.handleCart);
    const [textColor] = React.useState('#FFF');

    return (
        <nav className={"navbar navbar-expand-lg navbar-dark "+styles.bg_nav_color+" py-3 sticky-top"}>
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> 
                <img
                    className="img-fluid rounded float-left"
                    src="https://growagric.com/images/growagric.png"
                    alt="logo"
                    width="25%"
                />
                </NavLink>

                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center" style={{paddingTop:'10px'}}>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/"><h6><strong style={{color:textColor}}><i className="fa fa-house mr-1" aria-hidden="true"></i>Home</strong></h6></NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/farmer-pricing"><h6><strong style={{color:textColor}}><i className="fa fa-dollar mr-1" aria-hidden="true"></i>Pricing</strong></h6></NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact"><h6><strong style={{color:textColor}}><i className="fa fa-list mr-1" aria-hidden="true"></i>Contact</strong></h6></NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        <NavLink to="/cart" className={"btn "+ buttonStyle.custom_theme_button +" rounded-pill m-2"}><i className="fa fa-cart-shopping mr-1"></i> <strong>Cart ({state.length})</strong></NavLink>
                        <NavLink to="/login" className={"btn "+ buttonStyle.custom_theme_button +" rounded-pill m-2"}><i className="fa fa-sign-in-alt mr-1"></i> <strong>Login</strong></NavLink>
                        <NavLink to="/account-type" className={"btn "+ buttonStyle.custom_theme_button +" rounded-pill m-2"}><i className="fa fa-user-plus mr-1"></i><strong>Register</strong></NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar