import { useState, useEffect } from "react";
import { ProductList } from "./Components/ProductList";
import itemList from "./Assets/random_products_175.json";
import "./e-commerce-stylesheet.css";
import logo from "./Assets/Logo.png";
import basketIcon from "./Assets/shopping-basket.png";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  rating: number;
  image_link: string;
};

type BasketItem = Product & {
  basketQuantity: number;
};

function App() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList);
  const [sortBy, setSortBy] = useState<string>("AtoZ");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [basket, setBasket] = useState<BasketItem[]>([]);

  useEffect(() => {
    updateSearchedProducts();
  }, [searchTerm, sortBy, inStockOnly]);

  function showBasket() {
    const areaObject = document.getElementById("shopping-area");
    if (areaObject !== null) {
      areaObject.style.display = "block";
    }
  }

  function hideBasket() {
    const areaObject = document.getElementById("shopping-area");
    if (areaObject !== null) {
      areaObject.style.display = "none";
    }
  }

  function addToBasket(product: Product) {
    setBasket((prevBasket) => {
      const existingItem = prevBasket.find((item) => item.id === product.id);

      if (existingItem) {
        return prevBasket.map((item) =>
          item.id === product.id
            ? { ...item, basketQuantity: item.basketQuantity + 1 }
            : item
        );
      }

      return [...prevBasket, { ...product, basketQuantity: 1 }];
    });
  }

  function removeFromBasket(id: number) {
    setBasket((prevBasket) =>
      prevBasket
        .map((item) =>
          item.id === id
            ? { ...item, basketQuantity: item.basketQuantity - 1 }
            : item
        )
        .filter((item) => item.basketQuantity > 0)
    );
  }

  const totalCost = basket.reduce(
    (total, item) => total + item.price * item.basketQuantity,
    0
  );

  function updateSearchedProducts() {
    let filtered: Product[] = itemList.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (inStockOnly) {
      filtered = filtered.filter((product) => product.quantity > 0);
    }

    filtered.sort((a, b) => {
      if (sortBy === "ZtoA") return b.name.localeCompare(a.name);
      if (sortBy === "£LtoH") return a.price - b.price;
      if (sortBy === "£HtoL") return b.price - a.price;
      if (sortBy === "*LtoH") return a.rating - b.rating;
      if (sortBy === "*HtoL") return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    setSearchedProducts(filtered);
  }

  function getResultsText() {
    const count = searchedProducts.length;

    if (searchTerm.trim() !== "") {
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
          <img src={logo} alt="University of Liverpool logo" />
        </div>

        <div id="shopping-icon-area">
          <img src={basketIcon} onClick={showBasket} alt="Shopping basket" />
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
                      {item.name} (£{item.price.toFixed(2)}) -{" "}
                      {item.basketQuantity}
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
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>

          <label>
            <input
              type="checkbox"
              onChange={(e) => setInStockOnly(e.target.checked)}
            />
            In Stock Only
          </label>
        </div>
      </div>

      <p id="results-indicator">{getResultsText()}</p>

      <ProductList itemList={searchedProducts} addToBasket={addToBasket} />
    </div>
  );
}

export default App;
