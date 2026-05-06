type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  quantity: number;
  rating: number;
  image_link: string;
};

type ContentAreaProps = {
  itemList: Product[];
  addToBasket: (product: Product) => void;
};

export const ProductList = (props: ContentAreaProps) => {
  return (
    <div id="productList">
      {props.itemList.map((item) => (
        <div key={item.id} className="product">
          <div className="product-top-bar">
            <h2>{item.name}</h2>
            <p>
              £{item.price.toFixed(2)} ({item.rating}/5)
            </p>
          </div>

          <img
            src={
              new URL(
                `../Assets/Product_Images/${item.image_link}`,
                import.meta.url
              ).href
            }
            alt={item.name}
          />

          <button
            onClick={() => props.addToBasket(item)}
            disabled={item.quantity === 0}
          >
            {item.quantity === 0 ? "Out of stock" : "Add to basket"}
          </button>
        </div>
      ))}
    </div>
  );
};
