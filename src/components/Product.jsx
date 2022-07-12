import React from 'react';
import { Link } from 'react-router-dom';



const Product = ({ product, addToCart, addToCartAPI, user_id }) => {
    const p = product

    return (
        <>
            <div className="card border-0 rounded-1 mb-4">
                <img src={p.image} className="card-img-top" alt={p.name} />
                <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text mb-0">{p.price}</p>
                    <p>{p.description}</p>
                    <button onClick={() => { addToCartAPI(user_id, p.id); addToCart(p) }} className="btn btn-primary">Add to cart</button>
                </div>
            </div>
        </>
    )
};

export default Product;
