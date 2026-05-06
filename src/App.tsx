import { useState, useEffect } from "react";
import { ProductList } from "./Components/ProductList";
import itemList from "./Assets/random_products_175.json";
import "./e-commerce-stylesheet.css";

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
  const [selectedSortOption, setSelectedSortOption] = useState<string>("AtoZ");

  const [onlyShowAvailable, setOnlyShowAvailable] = useState<boolean>(false);

  const [visibleProducts, setVisibleProducts] = useState<Product[]>(itemList);

  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);

  useEffect(() => {
    refreshVisibleProducts();
  }, [searchTerm, selectedSortOption, onlyShowAvailable]);

  function openBasketPanel() {
    const basketArea = document.getElementById("shopping-area");

    if (basketArea !== null) {
      basketArea.style.display = "block";
    }
  }

  function closeBasketPanel() {
    const basketArea = document.getElementById("shopping-area");

    if (basketArea !== null) {
      basketArea.style.display = "none";
    }
  }

  function handleAddProduct(product: Product) {
    setBasketItems((currentBasket) => {
      const existingProduct = currentBasket.find(
        (item) => item.id === product.id
      );

      if (existingProduct !== undefined) {
        return currentBasket.map((item) =>
          item.id === product.id
            ? {
                ...item,
                basketQuantity: item.basketQuantity + 1,
              }
            : item
        );
      }

      return [
        ...currentBasket,
        {
          ...product,
          basketQuantity: 1,
        },
      ];
    });
  }

  function handleRemoveProduct(productId: number) {
    setBasketItems((currentBasket) =>
      currentBasket
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                basketQuantity: item.basketQuantity - 1,
              }
            : item
        )
        .filter((item) => item.basketQuantity > 0)
    );
  }

  function calculateBasketTotal() {
    return basketItems.reduce(
      (runningTotal, item) => runningTotal + item.price * item.basketQuantity,
      0
    );
  }

  function refreshVisibleProducts() {
    let updatedProducts: Product[] = [...itemList];

    updatedProducts = updatedProducts.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (onlyShowAvailable) {
      updatedProducts = updatedProducts.filter(
        (product: Product) => product.quantity > 0
      );
    }

    updatedProducts.sort((firstProduct: Product, secondProduct: Product) => {
      switch (selectedSortOption) {
        case "ZtoA":
          return secondProduct.name.localeCompare(firstProduct.name);

        case "£LtoH":
          return firstProduct.price - secondProduct.price;

        case "£HtoL":
          return secondProduct.price - firstProduct.price;

        case "*LtoH":
          return firstProduct.rating - secondProduct.rating;

        case "*HtoL":
          return secondProduct.rating - firstProduct.rating;

        case "AtoZ":
        default:
          return firstProduct.name.localeCompare(secondProduct.name);
      }
    });

    setVisibleProducts(updatedProducts);
  }

  function createResultsMessage() {
    const productCount = visibleProducts.length;
    const cleanSearchTerm = searchTerm.trim();

    if (cleanSearchTerm === "") {
      return productCount === 1 ? "1 Product" : `${productCount} Products`;
    }

    if (productCount === 0) {
      return "No search results found";
    }

    return productCount === 1 ? "1 Result" : `${productCount} Results`;
  }

  return (
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png"></img>
        </div>

        <div id="shopping-icon-area">
          <img
            id="shopping-icon"
            onClick={openBasketPanel}
            src="./src/assets/shopping-basket.png"
          ></img>
        </div>

        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={closeBasketPanel}>
              x
            </p>
          </div>

          {basketItems.length === 0 ? (
            <p>Your basket is empty</p>
          ) : (
            <>
              {basketItems.map((item) => (
                <div key={item.id} className="shopping-row">
                  <div className="shopping-information">
                    <p>
                      {item.name} (£
                      {item.price.toFixed(2)}) - {item.basketQuantity}
                    </p>
                  </div>

                  <button onClick={() => handleRemoveProduct(item.id)}>
                    Remove
                  </button>
                </div>
              ))}

              <p>Total: £{calculateBasketTotal().toFixed(2)}</p>
            </>
          )}
        </div>
      </div>

      <div id="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={(eventObject) => setSearchTerm(eventObject.target.value)}
        ></input>

        <div id="control-area">
          <select
            value={selectedSortOption}
            onChange={(eventObject) =>
              setSelectedSortOption(eventObject.target.value)
            }
          >
            <option value="AtoZ">By name (A - Z)</option>

            <option value="ZtoA">By name (Z - A)</option>

            <option value="£LtoH">By price (low - high)</option>

            <option value="£HtoL">By price (high - low)</option>

            <option value="*LtoH">By rating (low - high)</option>

            <option value="*HtoL">By rating (high - low)</option>
          </select>

          <input
            id="inStock"
            type="checkbox"
            checked={onlyShowAvailable}
            onChange={(eventObject) =>
              setOnlyShowAvailable(eventObject.target.checked)
            }
          ></input>

          <label htmlFor="inStock">In stock</label>
        </div>
      </div>

      <p id="results-indicator">{createResultsMessage()}</p>

      <ProductList itemList={visibleProducts} addToBasket={handleAddProduct} />
    </div>
  );
}

export default App;
