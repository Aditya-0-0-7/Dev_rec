import React from 'react';  
import './Toast.css'
  function Toast({msg}){
    return (
    <div class="toastContainer">
        {msg}
    </div>
    );
  }
export default Toast;