import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../css/styles.css'
import { BsCart4 } from "react-icons/bs";

export default class Navbar extends Component {

    render() {

        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container-xl">
                    <Link className="navbar-brand nav-link" to="/">GameRoom</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                        <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/shop">Shop</Link>
                            </li>

                            {
                                this.props.isLoggedIn ? (

                                    <li className="nav-item">
                                        <Link className="nav-link" to="/chat">Social</Link>
                                    </li>


                                ) : (
                                    null
                                )
                            }
                        </ul>

                        <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
                            {this.props.isLoggedIn ? (
                                <>
                                    <li className="nav-item">
                                        <p className="m-2 text-light" to="/login">Hello, {this.props.currentUser.username}</p>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-danger btn-sm" onClick={this.props.onLogOut}>Log Out</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Log in</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Sign Up</Link>
                                    </li>
                                </>
                            )}
                            <li className="nav-item">
                                <Link to='/cart' className='nav-link text-light cart'>
                                    <div className="cart-wrapper">
                                        <BsCart4 className='cart-icon' />
                                        {this.props.isLoggedIn ? (
                                            <div className="cart-badge">{this.props.cart.length}</div>
                                        ) : null}
                                    </div>

                                </Link>

                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}