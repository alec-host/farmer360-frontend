import ReactStars from "react-rating-stars-component";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import styles from "../css/profile.module.css";

import "../css/profile.extra.module.css";

/*
import { addCart } from "../redux/action";
*/

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";

import jsonObject from "../db/farmerlist.json";

const EntityList = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  
  let componentMounted = true;

  //const dispatch = useDispatch();

  /*
  const addProduct = (product) => {
    dispatch(addCart(product))
  }
  */

  useEffect(() => {
    const getEntities = async () => {
      setLoading(true);
      //const response = await fetch();
      //console.log(response);
      if(componentMounted){
        //setData(await response.clone().json());
        setData(jsonObject);
        //setFilter(await response.json());
        setFilter(jsonObject);
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };
    getEntities();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  /*
  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  }
  */
 
  const ShowEntities = () => {
    return (
      <>
        {
          /*
          <div className="buttons text-center py-5">
            <button className="btn btn-outline-dark btn-sm m-2" onClick={() => setFilter(data)}>All</button>
            <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("men's clothing")}>Men's Clothing</button>
            <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("women's clothing")}>
              Women's Clothing
            </button>
            <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("jewelery")}>Jewelery</button>
            <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("electronics")}>Electronics</button>
          </div>
          */
        }

        {filter.map((product) => {
          return (   
                <div className={"card mb-3 col-md-6" + " "+styles.justifyleft} style={{maxWidth:'40rem',paddingBlock:'15px',margin:'10px',background:''}}>
                  <div class="row g-0">
                    <div class="col-md-5" style={{background:'#005b96',textAlign:'center'}}>
                      <div class="col-md-10" className={styles.center}>
                        <img
                          className={styles.round}
                          src={product.image_url}
                          alt="Card"
                          width="200px"
                          height="200px"
                        />
                      </div>
                    </div>
                    <div class="col-md-7">
                      <div class="card-body">
                        <p><h5 class="card-title"><b>{product.name}</b></h5></p>
                        <p class="card-text"><small><b>Location</b>: {product.location}</small></p>
                        <p class="card-text"><small><b>Crop/Livestock</b>: {product.farmed_items}</small></p>
                        <p class="card-text"><small><b>Item(s) Available for Sale</b>: {product.sale_items_available}</small></p>
                        <p class="card-text">
                          <table cellPadding="1px" style={{width:'100%'}}>
                            <tr>
                              <td style={{width:'35%'}}><small><b><Link>View Shop</Link></b> (Rating): </small></td>
                              <td>
                                <ReactStars
                                  count={5}
                                  value={product.shop_rating}
                                  edit={false}
                                  size={24}
                                  isHalf={true}
                                  activeColor="#ffd700"
                                />
                              </td>
                            </tr>
                          </table>  
                        </p>
                        <p class="card-text"><small></small></p>
                        <p class="card-text"><small class="text-body-secondary"><span className={styles.more}></span></small></p>
                      </div>
                    </div>
                  </div>
                </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3">
        <div className="row">
          <div className="col-12">
            <div class="form my-3">
              <input type="text" placeholder="Search..." style={{width:'100%'}}/>
            </div>
          </div>
        </div>
        <div className="row justify-content-left">
          {loading ? <Loading /> : <ShowEntities />}
        </div>
      </div>
    </>
  );
};

export default EntityList;
