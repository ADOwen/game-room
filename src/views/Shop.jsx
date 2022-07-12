import Product from "../components/Product";


const Shop = ({products, addToCart, addToCartAPI, user_id}) => {

  
  
  const loopThroughProducts = (listOfProducts) => {
     return listOfProducts.map(product => < Product user_id={user_id} addToCartAPI ={addToCartAPI} addToCart={addToCart} key={product.id} product ={product}/>)
  }

  return (
      <div className='left-container-with-title'>
          <h2 className="section-title">Shop</h2>
          <div className="scroll-container">
            {loopThroughProducts(products)}
          </div>
      </div>
  )
};

export default Shop;
