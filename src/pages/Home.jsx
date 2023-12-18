import React from 'react';
import { Navbar, Main, Footer } from "../components";
import Products from '../components/Products';

function Home() {
  return (
    <>
      <Navbar />
      <Main />
      <Products />
      <Footer />
    </>
  )
}

export default Home