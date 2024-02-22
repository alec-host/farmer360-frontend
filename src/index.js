import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';


import { Home, Product, Products, AboutPage, ContactPage, Cart, Login, Register, RegisterBusiness, Checkout, PageNotFound, Dashboard, ProfilePage, DefaultPage, ShopPage, SettingPage, PricingFarmerPage, EditContactInfoPage, EditDemographicInfoPage, EditSignInSecurityPage, AddIndividualProfilePage, UpgradeSubscriptionPage, CreateShopPage, AddProductPage, AddInventoryPage, WalletPage, InboxPage, ConnectAndShareStoryPage, SwitchBoardPage, PricingBusinessPage, EditBusinessContactInfoPage, EditBusinessSignInSecurityPage, UpgradeBusinessSubscriptionPage, ProfileBusinessPage, DeleteAccountPage, WalletBalancePage, ShareStoryPage, ApiSurveyRequestPage, ServiceRequestPage, AdminLogin, AdminDashboard, AdminDefaultPage, AdminInboxPage, AdminApiRequestPage, AdminSurveyRequestpage, AdminBlockedCommentPage, AdminBlockedStoryPage, AdminSettingPage, PhoneVerification, PaymentMethod } from "./pages"
import FarmerInformationPage from './pages/dashboard/business/farmer-data/FarmerInformationPage';
import FarmerInfoPage from './pages/FarmerInfoPage';

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
        <Route path="/login/*" element={<Login />} />
        <Route path="/register/*" element={<Register />} />
        <Route path="/farmer-list/*" element={<FarmerInfoPage />} />
        <Route path="/request-service/*" element={<ServiceRequestPage />} />
        <Route path="/register/business/*" element={<RegisterBusiness />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/product/*" element={<PageNotFound />} />
        <Route path="/farmer-pricing" element={<PricingFarmerPage />} />
        <Route path="/business-pricing" element={<PricingBusinessPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<ProfilePage />} />
        <Route path="/dashboard/default" element={<DefaultPage />} />
        <Route path="/dashboard/shop" element={<ShopPage />} />
        <Route path="/dashboard/setting" element={<SettingPage />} />
        <Route path="/dashboard/wallet" element= { <WalletPage /> } />
        <Route path="/dashboard/connect-share-stories" element={ <ShareStoryPage /> } />
        <Route path="/dashboard/connect-share-stories/stories" element={ <ConnectAndShareStoryPage /> } />
        <Route path="/dashboard/edit-profile/stepper" element={<AddIndividualProfilePage />} />
        <Route path="/dashboard/edit-profile/contact" element={<EditContactInfoPage />} />
        <Route path="/dashboard/edit-profile/demographic" element={<EditDemographicInfoPage />} />
        <Route path="/dashboard/edit-profile/security" element={<EditSignInSecurityPage />} />
        <Route path="/dashboard/edit-profile/upgrade" element={<UpgradeSubscriptionPage />} />
        <Route path="/dashboard/shop/create-shop" element={<CreateShopPage />} />
        <Route path="/dashboard/shop/add-product" element={<AddProductPage />} />
        <Route path="/dashboard/shop/add-inventory" element={ <AddInventoryPage /> } />
        <Route path="/dashboard/wallet/wallet" element={ <WalletBalancePage /> } />
        <Route path="/dashboard/inbox/inbox" element={ <InboxPage /> } />
        <Route path="/account-type" element={ <SwitchBoardPage /> } />
        <Route path="/dashboard/business/edit-profile/contact" element={ <EditBusinessContactInfoPage /> } />
        <Route path="/dashboard/business/edit-profile/security" element={ <EditBusinessSignInSecurityPage /> } />
        <Route path="/dashboard/business/edit_profile/upgrade" element={ <UpgradeBusinessSubscriptionPage /> } />
        <Route path="/dashboard/business" element={ <ProfileBusinessPage />} />
        <Route path="/dashboard/business/farmer-data/*" element={ <FarmerInformationPage /> } />
        <Route path="/dashboard/settings/delete" element={ <DeleteAccountPage /> } />
        <Route path="/dashboard/business/request-paid-service/*" element={ <ApiSurveyRequestPage /> } />
        <Route path="/admin/login" element={ <AdminLogin /> } />
        <Route path='/admin/dashboard' element={ <AdminDashboard />} />
        <Route path="/admin/dashboard/default" element={ <AdminDefaultPage />} />
        <Route path="/admin/dashboard/*" element={ <AdminDefaultPage />} />
        <Route path='/admin/dashboard/inbox/inbox' element={ <AdminInboxPage /> } />
        <Route path='/admin/dashboard/request/api' element={ <AdminApiRequestPage /> } />
        <Route path='/admin/dashboard/request/survey' element={<AdminSurveyRequestpage /> } />
        <Route path='/admin/dashboard/request/survey/*' element={ <AdminSurveyRequestpage />} />
        <Route path='/admin/dashboard/story-comment/story' element={ <AdminBlockedStoryPage /> } />
        <Route path='/admin/dashboard/story-comment/comment' element={ <AdminBlockedCommentPage /> } />
        <Route path='/admin/dashboard/settings' element={ <AdminSettingPage /> } />
        <Route path='/phone-verification/*' element={ <PhoneVerification/> } />
        <Route path='/payment-method' element={ <PaymentMethod /> } />
      </Routes>
    </Provider>
  </BrowserRouter>
);