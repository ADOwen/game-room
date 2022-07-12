import './css/styles.css'
import Navbar from './components/Navbar';
import {Routes, Route} from 'react-router-dom'
import Register from './views/Register';
import Login from './views/Login';
import React, { useState, useEffect } from 'react';
import Blog from './views/Blog';
import Shop from './views/Shop';
import SingleProduct from './views/SingleProduct';
import Home from './views/Home';
import CreatePost from './views/CreatePost';
import Cart from './views/Cart';
import Game from './views/Game';
import StripeShop from './views/StripeShop';
import Legend from './components/Legend';
import { getDatabase, ref, child, get, set } from 'firebase/database';
import { Curves } from 'phaser';

// create demo products
const demoProducts = [
  {
    id: 1,
    name: "Extra Lives",
    image: 'https://cdn.dribbble.com/users/192231/screenshots/14773461/artboard_4_4x.png',
    description: "Ldfjlkasjd lkjasdklfj aklsdjf kljlj laksjdf lkjaklsdj lkasdf ",
    price: 2,
  },
  {
    id: 2,
    name: "Extra Lives",
    image: 'https://cdn.dribbble.com/users/192231/screenshots/14773461/artboard_4_4x.png',
    description: "Ldfjlkasjd lkjasdklfj aklsdjf kljlj laksjdf lkjaklsdj lkasdf ",
    price: 2,
  },
  {
    id: 3,
    name: "Extra Lives",
    image: 'https://cdn.dribbble.com/users/192231/screenshots/14773461/artboard_4_4x.png',
    description: "Ldfjlkasjd lkjasdklfj aklsdjf kljlj laksjdf lkjaklsdj lkasdf ",
    price: 2,
  },
  {
    id: 4,
    name: "Extra Lives",
    image: 'https://cdn.dribbble.com/users/192231/screenshots/14773461/artboard_4_4x.png',
    description: "Ldfjlkasjd lkjasdklfj aklsdjf kljlj laksjdf lkjaklsdj lkasdf ",
    price: 2,
  },
  {
    id: 5,
    name: "Extra Lives",
    image: 'https://cdn.dribbble.com/users/192231/screenshots/14773461/artboard_4_4x.png',
    description: "Ldfjlkasjd lkjasdklfj aklsdjf kljlj laksjdf lkjaklsdj lkasdf ",
    price: 2,
  },
]

function App() {
  
  
  let user = localStorage.getItem('user')
  user = JSON.parse(user) 
  
  // Storing user info locally
  
  // state
  const [currentUser, setCurrentUser] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(() => false)
  const [products, setProducts] = useState(demoProducts)
  const [cart, setCart] = useState(()=>[])
  const [stripeCart, setStripeCart] = useState({total: 0, size: 0, items: {}})

  // firebase database methods
  const addToStripeCart = (product) => {
    const copyCart = {...stripeCart}
    console.log(product,'trying to add this')

    copyCart.size++;

    copyCart.items[product.id] ? copyCart.items[product.id].quantity +=1 
                               : copyCart.items[product.id]= { quantity: 1, data: product}

    // copyCart.total += product.price      
    
    if (isLoggedIn) {
      const uid = currentUser.id
      const db= getDatabase();
      set(ref(db, `carts/${uid}`), copyCart)
    }
    setStripeCart(copyCart)
  }

  const checkDatabase = async () => {
    if (isLoggedIn) {
      const dbRef = ref(getDatabase());
      const snapshot = await get(child(dbRef, `carts/${currentUser.id}` ));
      if (snapshot.exists()) {
        // update stripeCart to this value
        console.log(snapshot.val())
      } else {
        console.log('No data available')
      }    
    }
  }
  
  // auth methods
  const logMeIn = (user) => {
    setCurrentUser(user)
    setIsLoggedIn(true)
    getCartAPI(user.id)
    
  }
  const logMeOut = ()=>{
    setCurrentUser({})
    setIsLoggedIn(false)
    setCart([])
    localStorage.removeItem('user')
  }

  // cart/shop methods

  const getProducts = async()=>{
      const res = await fetch('https://ado-gameroom-api.herokuapp.com/api/shop/products')
      const data = await res.json()
      setProducts(data)
  }

  const addToCart = (product) => {
    setCart(()=> 
       [...cart, product]
    )
  }
  
  const removeFromCart = (product) => {
    let newCart = [...cart];
    for(let i = newCart.length - 1; i >= 0; i--){
      if(product.id === newCart[i].id){
        newCart.splice(i,1)
        break
      }
    }
    setCart(newCart)
  }

  

  const sumTotalCart = (cart) => {
    let total = 0;
    for(let i = 0; i < cart.length; i++){
      total += cart[i].price
    }
    return total.toFixed(2)
  }

  // api cart/shop methods
  const addToCartAPI = async (user_id, product_id) => {
    const res = await fetch('https://ado-gameroom-api.herokuapp.com/api/addToCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user_id,
        product_id: product_id
      })
    })
    const data = await res.json()
  }
  const removeFromCartAPI = async (user_id, product_id) => {
    const res = await fetch('https://ado-gameroom-api.herokuapp.com/api/removeFromCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user_id,
        product_id: product_id
      })
    })
    const data = await res.json()
  }

  const getCartAPI = async (user_id) =>{
    const res = await fetch('https://ado-gameroom-api.herokuapp.com/api/getCart',{
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user_id
      })
    })
    const data = await res.json()
    console.log(data,'did i run?')
    setCart(data)
  }
 
  
  
  // fetching list of products
  useEffect(()=>{
    getProducts()
  },[])

  // check if there is a user stored locally and log them in
  useEffect(()=>{
    if(user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      console.log(user)
    }
  },[])

  // fetch the user cart
  useEffect(()=>{
    if (isLoggedIn){
      getCartAPI(currentUser.id)
    }
  },[currentUser.id] )
  
  
  return (
    
    <div id="app">  
      <Navbar 
        currentUser={currentUser}
        isLoggedIn={isLoggedIn} 
        onLogOut={logMeOut}
        sumTotalCart={sumTotalCart}
        cart={cart}
      /> 
      <div id="main" className='container-xl position-relative' style={{overflow: "visible !important"}}>      
        <Routes>
          <Route path='/' element= {<Home/>}/>
          <Route path='/shop' element={<Shop products= {products} user_id={currentUser.id} addToCartAPI ={addToCartAPI} addToCart={addToCart}/>} />
          <Route path='/shop/:id' element={<SingleProduct user_id={currentUser.id} addToCartAPI ={addToCartAPI} addToCart ={addToCart}/>} />
          <Route path='/stripe/shop' element={<StripeShop addToStripeCart={addToStripeCart}/>} />
          <Route path='/cart' element={<Cart sumTotalCart ={sumTotalCart} removeFromCart={removeFromCart} 
                                        currentUser={currentUser} removeFromCartAPI={removeFromCartAPI}cart={cart}/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login logMeIn = {logMeIn}/>} />
          <Route path='/chat' element={<Blog currentUser={currentUser}/>} />
          <Route path='/posts/create' element={<CreatePost currentUser={currentUser}/>} />
          <Route path='/game' element={<Game/>} />
        </Routes>
        <Legend />
      </div>
    </div>
  );
}

export default App;
