import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/frontend_assets/assets'



interface LoginPopupProps {
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginPopup  = ({setShowLogin}:LoginPopupProps) => {

    const [currState,setCurrState] = useState<String>("Sign Up")

  return (
    <div className='login-popup'>
       <form action="" className="login-popup-container">
        <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt=''/>
        </div>
        <div className="login-popup-inputs">
            <input type="text" placeholder='Your Name' required />
            <input type='email' placeholder='Your email' required/>
            <input type='password' placeholder='Password' required/>
        </div>
        <button>{currState === "Sign Up"?"Create Account" : "Login"}</button>
       </form>
    </div>
  )
}

export default LoginPopup
