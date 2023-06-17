import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth, provider} from '../config';
import {signInWithPopup} from "firebase/auth";
import MainScreen from '../appScreen/mainScreen';
import logo from '../Resources/logo.png'
import './login.css';
function Login()
{
    const [user] = useAuthState(auth);
    const [isLoggedIn,updateLogIn]=useState(false);
    const [email,setEmail] = useState("");
    useEffect(()=>{
        user?updateLogIn(true):updateLogIn(false);
    },[]);
    const handleLogin = () => {
        signInWithPopup(auth,provider)
          .then((result) => {
            setEmail(result._tokenResponse.email);
            updateLogIn(true);
          })
          .catch((error) => {
            console.error('Login error:', error);
          });
      };
    return(
        <div class={!isLoggedIn?"loginContainer":""}>
          {!isLoggedIn&&<img src={logo} class="loginLogo"/>}
            {isLoggedIn?<MainScreen updateLogIn={updateLogIn} email={email}/>:
            <button class="loginButton" onClick={handleLogin}>Login with Gmail</button>}
        </div>
    );
}
export default Login;