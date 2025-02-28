import React from 'react'
import './Navbar.css'
import {assets} from '../../assets/frontend_assets/assets'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={assets.logo} alt='' />
    </div>
  )
}

export default Navbar
