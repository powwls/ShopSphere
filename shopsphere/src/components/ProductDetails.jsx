import { useState } from "react";
import { X, Star, Plus, Minus, ShoppingCart } from "lucide-react";

function ProductDetails({
  product,
  isProductOpen,
  setIsProductOpen,
  addToCart,
}) {
  const [quantity, setQuantity] = useState(1);

  if (!isProductOpen || !product) return null;

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setQuantity(1);
    setIsProductOpen(false);
  };

  return (
    <div
      className="product-modal-overlay"
      onClick={() => setIsProductOpen(false)}
    >
      <div
        className="product-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-product-modal"
          onClick={() => setIsProductOpen(false)}
        >
          <X size={24} />
        </button>

        <div className="product-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-details-info">
          <p className="product-details-category">
            {product.category}
          </p>

          <h2>{product.name}</h2>

          <div className="product-details-rating">
            <Star size={18} fill="currentColor" />
            <span>{product.rating || 4.8}</span>
          </div>

          <h3>
            ₱{product.price.toLocaleString()}
          </h3>

          <p className="product-description">
            {product.description}
          </p>

          <div className="quantity-controls">
            <button onClick={decreaseQuantity}>
              <Minus size={18} />
            </button>

            <span>{quantity}</span>

            <button onClick={increaseQuantity}>
              <Plus size={18} />
            </button>
          </div>

          <button
            className="details-add-cart-button"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;