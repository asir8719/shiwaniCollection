import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import Dashboard from './pages/admin/Dashboard'
import AdminLayout from './components/admin/AdminLayout'
import AdminCategory from './pages/admin/AdminCategory'
import AdminProduct from './pages/admin/AdminProduct'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/Login'
import ProtectedRoute from './components/ProtectedRoute'
import { SettingsProfile } from './components/admin/settings/profile'
import { Settings } from './components/admin/settings'
import AdminAdvertisement from './pages/admin/AdminAdvertisements'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/admin' element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='categories' element={<AdminCategory />} />
            <Route path='products' element={<AdminProduct />} />
            <Route path='advertisements' element={<AdminAdvertisement />} />
            <Route path='settings' element={<Settings />}>
              <Route index element={<SettingsProfile />} />
              {/* <Route path='account' element={<SettingsAccount />} /> */}
              {/* <Route path='appearance' element={<SettingsAppearance />} />
              <Route path='notifications' element={<SettingsNotifications />} />
              <Route path='display' element={<SettingsDisplay />} /> */}
            </Route>
          </Route>
        </Route>
        
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='product' element={<ProductListing  />} />
          <Route path='product/:id' element={<ProductDetail />} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
