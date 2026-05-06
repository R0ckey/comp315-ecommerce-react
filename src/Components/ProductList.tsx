type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  rating: number;
  image_link: string;
};

type ProductListProps = {
  itemList: Product[];
  addToBasket: (product: Product) => void;
};

export const ProductList = (props: ProductListProps) => {
  return (
    <div id="productList">
      {props.itemList.map((product) => (
        <div key={product.id} className="product">
          <div className="product-top-bar">
            <h2>{product.name}</h2>

            <p>
              £{product.price.toFixed(2)} ({product.rating}/5)
            </p>
          </div>

          <img
            src={
              new URL(
                `../Assets/Product_Images/${product.image_link}`,
                import.meta.url
              ).href
            }
            alt={product.name}
          />

          <button
            value={product.id}
            onClick={() => props.addToBasket(product)}
            disabled={product.quantity === 0}
          >
            {product.quantity === 0 ? "Out of stock" : "Add to basket"}
          </button>
        </div>
      ))}
    </div>
  );
};
