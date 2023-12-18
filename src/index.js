import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';


import { Home, Product, Products, AboutPage, ContactPage, Cart, Login, Register, Checkout, PageNotFound, Dashboard, ProfilePage, DefaultPage, ShopPage, SettingPage, PricingFarmerPage, EditContactInfoPage, EditDemographicInfoPage, EditSignInSecurityPage, AddIndividualProfilePage, UpgradeSubscriptionPage, CreateShopPage, AddProductPage, AddInventoryPage, WalletPage, InboxPage, ConnectSharePage, ConnectAndShareStoryPage, SwitchBoardPage } from "./pages"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/product/*" element={<PageNotFound />} />
        <Route path="/farmer-pricing" element={<PricingFarmerPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/default" element={<DefaultPage />} />
        <Route path="/dashboard/shop" element={<ShopPage />} />
        <Route path="/dashboard/setting" element={<SettingPage />} />
        <Route path="/dashboard/edit-profile/stepper" element={<AddIndividualProfilePage />} />
        <Route path="/dashboard/edit-profile/contact" element={<EditContactInfoPage />} />
        <Route path="/dashboard/edit-profile/demographic" element={<EditDemographicInfoPage />} />
        <Route path="/dashboard/edit-profile/security" element={<EditSignInSecurityPage />} />
        <Route path="/dashboard/edit-profile/upgrade" element={<UpgradeSubscriptionPage />} />
        <Route path="/dashboard/shop/create-shop" element={<CreateShopPage />} />
        <Route path="/dashboard/shop/add-product" element={<AddProductPage />} />
        <Route path="/dashboard/shop/add-inventory" element={ <AddInventoryPage /> } />
        <Route path="/dashboard/wallet/wallet" element={ <WalletPage/> } />
        <Route path="/dashboard/inbox/inbox" element={ <InboxPage/> } />
        <Route path="/dashboard/connect-share-stories" element={ <ConnectAndShareStoryPage /> } />
        <Route path='/account-type' element={ <SwitchBoardPage /> } />
      </Routes>
    </Provider>
  </BrowserRouter>
);