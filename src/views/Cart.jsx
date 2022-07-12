import React from 'react';


const Cart = ({ cart, removeFromCart,removeFromCartAPI, sumTotalCart, currentUser}) => {
    const getQuantity = (cartItem, cartList) => {
        let count = 0;
        for (let item of cartList) {
            if (cartItem.id === item.id) {
                count++;
            }
        }
        return count
    }

    const getUniqueCart = (cartList) => {
        let uniqueCart = []
        let ids = new Set()
        for (let item of cartList) {
            if (!ids.has(item.id)) {
                uniqueCart.push(item);
                ids.add(item.id);
            }
        }
        return uniqueCart
    }
    const uniqueCart = getUniqueCart(cart)


    return (
        <>
            {uniqueCart.length > 0 ? (
                <div className='left-container-with-title'>
                    <h2 className="section-title">Cart</h2>
                    <div className="scroll-container">
                        <div className='table-responsive'>
                            <table className='table table-light table-borderless'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uniqueCart.map(p => (
                                        <tr key={p.id}>
                                            <td>{p.name}</td>
                                            <td>{getQuantity(p, cart)}</td>
                                            <td>${p.price}</td>
                                            <td>${(getQuantity(p, cart) * p.price).toFixed(2)}</td>
                                            <td>
                                                <button  onClick={()=>{removeFromCartAPI(currentUser.id, p.id); removeFromCart(p)} } className='btn btn-danger btn-sm'>Remove</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th>TOTAL</th>
                                        <td></td>
                                        <td></td>
                                        <td>${sumTotalCart(cart)}</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                            <button className='btn btn-primary btn-sm'>Check Out?</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='left-container-with-title'>
                    <h2 className="section-title">Cart</h2>
                    <div className="scroll-container">
                        <h3>Your cart is empty</h3>
                    </div>
                </div>
            )
            }
        </>
    )
};

export default Cart;

