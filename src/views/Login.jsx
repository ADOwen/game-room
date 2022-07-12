import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';

const Login = ({logMeIn}) => {
    const [redirect, setRedirect] = useState(null)
    const auth = getAuth()

    const sendCredentials = async (e) => {
        e.preventDefault();
        const res = await fetch('https://ado-gameroom-api.herokuapp.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
               username: e.target.username.value,
               password: e.target.password.value
            })
        })
        const data = await res.json()
        if (data.status === 'success'){
            logMeIn(data.data)
            // saving user to local storage
            localStorage.setItem(
                'user', JSON.stringify(data.data)
            )
            setRedirect('/shop')
        }
    }

    const signInGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider)
        if (res.user){
            const myUser = {...res.user, username: res.user.displayName, id: res.user.uid}
            logMeIn(myUser)
            localStorage.setItem(
                'user', JSON.stringify(myUser)
            )
            setRedirect('/shop')
        }

    }
        return (
            redirect ? <Navigate to="/shop"/>:
            <div className="left-container">
                <div className='container'>
                    <form onSubmit={(e)=>{sendCredentials(e)}}>
                        <div className="form-group">
                            <fieldset>
                                <label htmlFor="username">Username</label>
                                <input className="form-control" id="username" name="username" placeholder="Username" required="" type="text" />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="password">Password</label>
                                <input className="form-control" id="password" name="password" placeholder="Password" required="" type="password"/>
                            </fieldset>
                            <fieldset>
                                <label htmlFor="remember_me">Remember Me</label>
                                <input className="form-check-input" id="remember_me" name="remember_me" type="checkbox" value="y" />
                            </fieldset>
                            <input className="btn btn-primary" id="submit" name="submit"  type="submit" value="Sign In" />
                        </div>
                    </form>
                </div>
                {/* <button onClick={()=> signInGoogle()}>Sign in with google</button> */}
                <div className="mt-2 text-center">Don't have an account? <Link className='text-decoration-none' to="/register">Register</Link></div>
            </div>
        )
    }

export default Login;