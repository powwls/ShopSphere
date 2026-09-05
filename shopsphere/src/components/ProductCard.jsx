import {
  ShoppingCart,
  Star,
  Heart,
} from "lucide-react";

function ProductCard({
  product,
  addToCart,
  openProduct,
  wishlist,
  toggleWishlist,
}) {
  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  );

  return (
    <div className="product-card">

      {/* WISHLIST BUTTON */}
      <button
        type="button"
        className={`wishlist-button ${
          isWishlisted ? "active" : ""
        }`}
        onClick={() => toggleWishlist(product)}
        aria-label="Toggle wishlist"
      >
        <Heart
          size={20}
          fill={
            isWishlisted
              ? "currentColor"
              : "none"
          }
        />
      </button>

      {/* PRODUCT IMAGE */}
      <div
        className="product-image-container"
        onClick={() => openProduct(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>

      {/* PRODUCT INFO */}
      <div className="product-info">

        <p className="product-category">
          {product.category}
        </p>

        {/* CLICKABLE PRODUCT NAME */}
        <h3
          className="product-name"
          onClick={() => openProduct(product)}
        >
          {product.name}
        </h3>

        {/* RATING */}
        <div className="product-rating">
          <Star
            size={16}
            fill="currentColor"
          />

          <span>
            {product.rating || 4.8}
          </span>
        </div>

        {/* PRICE + CART */}
        <div className="product-bottom">

          <strong className="product-price">
            ₱{product.price.toLocaleString()}
          </strong>

          <button
            type="button"
            className="add-cart-button"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={20} />
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductCard;