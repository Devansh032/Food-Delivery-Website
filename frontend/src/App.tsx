  import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar' 
import {Route, Routes} from 'react-router-dom'
import Cart from './pages/Cart/cart'
import Home from './pages/Home/home.tsx'
import PlaceOrder from './pages/PlaceOrder/Placeorder.tsx'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import SmartQueryBox from './components/SmartQueryBox/SmartQueryBox'
import FilteredPage from './pages/Filtered/FilteredPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const [showLogin, setShowLogin] = useState<boolean>(false);

  return (
    <>
    {showLogin?<LoginPopup setShowLogin = {setShowLogin} />:<></>}
      <div className='app'>
        <ToastContainer/>
        <Navbar setShowLogin ={setShowLogin}/>
        <SmartQueryBox />
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/filtered' element={<FilteredPage/>} />
          <Route path='/cart' element={<Cart /> } />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
        </Routes>
      </div>
      <Footer/>
    </>
  )
}

export default App
