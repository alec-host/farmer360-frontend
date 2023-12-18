import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import parse from 'html-react-parser';

import API_END_POINT from "../endpoint/apiRoute";
import FlyingAgricButton from "./FlyingAgricButton";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product))
  }

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const url = `${API_END_POINT}/api/v1/getProducts?owner_reference_number=f9268420-4d4f-4a36-8a1d-d80200d793c2&email=pirate@ymail.com&_page=1&_limit=10`;
      const response = await fetch(url);
      if(componentMounted){
        await response.clone().json().then(data=>{
          console.log(data);
          setData(data?.data);
          console.log(data?.data);
          setFilter(data?.data);
        });
        setLoading(false);
      }
      return () => {
        componentMounted = false;
      };
    };
    getProducts();
  },[]);

  console.log(data);

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

  const filterProduct = (cat) => {
    const updatedList = data?.filter((item) => item.category === cat);
    setFilter(updatedList);
  }
  const ShowProducts = () => {
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

        {filter?.map((product) => {
          return (
            <div id={product.product_reference_number} key={product.product_reference_number} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
              <div className="card text-center h-100" key={product.product_reference_number}>
                <div className="bg-image rounded" data-mdb-ripple-color="light">
                  <img
                    className="card-img-top p-5"
                    src={product.image_url}
                    alt="Card"
                    height={250}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">
                    {product.product_name.substring(0, 12)}...
                  </h5>
                  <div className="card-text">
                    {parse(String(product.description.substring(0, 90)))}...
                  </div>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item lead">{product.currency} {product.price}</li>
                  {/* <li className="list-group-item">Dapibus ac facilisis in</li>
                    <li className="list-group-item">Vestibulum at eros</li> */}
                </ul>
                <div className="card-body">
                  <Link to={"/product/" + product.product_reference_number} className="btn btn-dark m-1">
                    Buy Now
                  </Link>
                  <div className="btn btn-dark m-1" onClick={() => addProduct(product)}>
                    <FlyingAgricButton 
                      key={product.image_url}
                      src={product.image_url} 
                      targetTop={"10%"} 
                      targetLeft={"70%"}>
                      <i className="fas fa-cart-plus"></i> Add to Cart
                    </FlyingAgricButton>
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
            <h5 className="text-center">Products</h5>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
