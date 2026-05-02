import { useState, useEffect } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json';
import './e-commerce-stylesheet.css'
import logo from "./Assets/Logo.png";
import basketIcon from "./Assets/shopping-basket.png";

type Product = {
  id: number
	name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [sortBy, setSortBy] = useState<string>("name");
  const [inStockOnly] = useState<boolean>(false);
  const [basket, setBasket] = useState<any[]>([]);

  // ===== Hooks =====
  useEffect(() => {
    updateSearchedProducts();
  }, [searchTerm, sortBy, inStockOnly]);
  
  // ===== Basket management =====
  function showBasket(){
    let areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='block';
    }
  }

  function hideBasket(){
    let areaObject = document.getElementById('shopping-area');
    if(areaObject !== null){
      areaObject.style.display='none';
    }
  }

  const addToBasket = (product: Product) => {
    console.log("Added:", product.name);
    setBasket((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromBasket = (id: number) => {
    setBasket((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalCost = basket.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ===== Search =====
  function updateSearchedProducts() {
    let holderList: Product[] = itemList;

    let filtered = holderList.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ✅ In-stock filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.quantity > 0);
    }

    // ✅ Sorting
    filtered.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    setSearchedProducts(filtered);
  }

  function getResultsText() {
    const count = searchedProducts.length;

    if (searchTerm !== "") {
      if (count === 0) return "No search results found";
      if (count === 1) return "1 Result";
      return `${count} Results`;
    }

    if (count === 1) return "1 Product";
    return `${count} Products`;
  }

 

  return (
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src={logo} />
        </div>
        <div id="shopping-icon-area">
          <img src={basketIcon} onClick={showBasket} />
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>
              x
            </p>
          </div>
          {basket.length === 0 ? (
            <p>Your basket is empty</p>
          ) : (
            <>
              {basket.map((item) => (
                <div className="shopping-row" key={item.id}>
                  <div className="shopping-information">
                    <p>
                      {item.name} (£{item.price.toFixed(2)}) - {item.quantity}
                    </p>
                  </div>

                  <button onClick={() => removeFromBasket(item.id)}>
                    Remove
                  </button>
                </div>
              ))}

              <p>Total: £{totalCost.toFixed(2)}</p>
            </>
          )}
        </div>
      </div>
      <div id="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div id="control-area">
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <p className="results-indicator">{getResultsText()}</p>
      <ProductList itemList={searchedProducts} addToBasket={addToBasket} />
    </div>
  );
}

export default App
