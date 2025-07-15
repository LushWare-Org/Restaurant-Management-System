import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomeScreen from './screens/HomeScreen';
import Footer from './components/Footer';
import ScrollRestoration from './components/ScrollRestoration';
// import Login from './components/Login';
// import Register from './components/Register';
import BillingInvoice from './screens/BillingInvoice';
import CustomerFeedback from './screens/CustomerFeedback';
import InventoryStockManage from './screens/InventoryStockManage';
import KitchenDisplay from './screens/KitchenDisplay';
import LoyaltyPrograms from './screens/LoyaltyPrograms';
import MenuManagement from './screens/MenuManagement';
import POSsystem from './screens/POSsystem'; 
import RestaurantAnalytics from './screens/RestaurantAnalytics';
import Settings from './screens/Settings';
import StaffManagement from './screens/StaffManagement';
import TableReservation from './screens/TableReservation';
import WalkinManagement from './screens/WalkinManagement';
import { AuthProvider } from './components/context/AuthContext';

const Layout = () => {
  return (
    <>
      {/* <Navigation /> */}
      <Outlet />
      {/* <Footer /> */}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <ScrollRestoration />
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/billing-invoice" element={<BillingInvoice />} />
            <Route path="/customer-feedback" element={<CustomerFeedback />} />
            <Route path="/inventory-stock-manage" element={<InventoryStockManage />} />
            <Route path="/kitchen-display" element={<KitchenDisplay />} />  
            <Route path="/loyalty-programs" element={<LoyaltyPrograms />} />
            <Route path="/menu-management" element={<MenuManagement />} />
            <Route path="/pos-system" element={<POSsystem />} />
            <Route path="/restaurant-analytics" element={<RestaurantAnalytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/staff-management" element={<StaffManagement />} />
            <Route path="/table-reservation" element={<TableReservation />} />
            <Route path="/walkin-management" element={<WalkinManagement />} />
            
            {/* Protected Routes */}
            {/* <Route path="/login" element={<Login />} /> */}
            {/* <Route path="/register" element={<Register />} /> */}
          </Route>
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;