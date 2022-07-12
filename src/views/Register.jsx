import React, { Component } from 'react';
import { Link, Navigate } from 'react-router-dom';
import "../css/styles.css";

export default class Register extends Component {
    constructor(){
        super();
        this.state ={
            redirect: null
        }
    }
    sendCredentials = async (e) => {
        e.preventDefault();
        const res = await fetch('https://ado-gameroom-api.herokuapp.com/api/register', {
            headers: {
                'Content-Type': "application/json"
            },
            method: 'POST',
            body: JSON.stringify({
               username: e.target.username.value,
               email: e.target.email.value,
               password: e.target.password.value,
               confirmPassword: e.target.confirm_password.value,
            })
        });
        const data = await res.json()
        if (data.status === 'success'){
            this.setState({
                redirect: '/login'
            })
        }
    }


    render() {

        return ( this.state.redirect ? <Navigate to="/login"/> :
            <div className="left-container">
                <div className='container'>
                    <form onSubmit={(e)=>{this.sendCredentials(e)}} >
                        <div className="form-group">
                            <fieldset>
                                <label htmlFor="username">Username</label>
                                <input className="form-control" id="username" name="username" placeholder="Username" required="" type="text"/>
                            </fieldset>
                            <fieldset>
                                <label htmlFor="email">Email</label>
                                <input className="form-control" id="email" name="email" placeholder="Email" required="" type="text"/>
                            </fieldset>
                            <fieldset>
                                <label htmlFor="password">Password</label>
                                <input className="form-control" id="password" name="password" placeholder="Password" required="" type="password"/>
                            </fieldset>
                            <fieldset>
                                <label htmlFor="confirm_password">Confirm Password</label>
                                <input className="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm Password" required="" type="password"/>
                            </fieldset>
                            <input className="btn btn-primary" id="submit" name="submit" type="submit" value="Submit" />
                        </div>
                    </form>
                </div>
                <div className="mt-2 text-center">Already have an account? <Link className='text-decoration-none' to="/login">Log in</Link></div>
            </div>
        )
    }
}
