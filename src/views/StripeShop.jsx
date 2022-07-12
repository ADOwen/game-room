import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STRIPE_SECRET_KEY=process.env.REACT_APP_STRIPE_SECRET_KEY

const StripeShop = ({addToStripeCart}) => {
    const [products, setProducts]= useState([])

    const getProducts = async () => {
        const res = await fetch('https://api.stripe.com/v1/products', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${STRIPE_SECRET_KEY}`
            }
        })
        const data = await res.json()
    
        return data
    }
    useEffect( async ()=>{
        const data = await getProducts()
        setProducts(data.data)
    }, [])

    const loopThroughProducts= (arr) => {
        return arr.map(p =>(           
            <div key={p.id} className="container productSize mt-3">
                <div className="card text-decoration-none text-dark">
                    <Link  to={`/shop/${p.id}`}>
                        <img src={ p.images[0] } className="card-img-top p-4" alt="..."/>
                    </Link>
                        <div className="card-body">
                            <h5 className="card-title">{ p.name }</h5>
                            <p className="card-text">{ p.description }</p>
                            <h3>{p.price}</h3> <button onClick={()=> addToStripeCart(p)} className='btn btn-secondary'>Add To Cart</button>
                        </div>
                </div>
            </div>   
        ))
    }

    // const gotoStripe = () => {
    //     fetch('http://localhost:5000/stripe/createCheckoutSession',{
    //         method: 'POST',
    //         body: JSON.stringify({
    //             cart: []
    //         })
    //     })


    // }

  return (
      <div id="check">
          <h1>Shop Page</h1>
          {loopThroughProducts(products)}
          <br />
          <form action='https://ado-gameroom-api.herokuapp.com/stripe/createCheckoutSession' method="POST">
              <button type="submit" className='btn btn-primary'>Check Out</button>
          </form>
      </div>
  )
};

export default StripeShop;
