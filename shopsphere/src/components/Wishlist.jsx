import { Heart, ShoppingCart, Trash2 } from "lucide-react";

function Wishlist({
  wishlist,
  toggleWishlist,
  addToCart,
  openProduct,
}) {
  return (
    <section className="wishlist-page">
      <div className="wishlist-container">

        <div className="wishlist-header">
          <p className="section-subtitle">
            YOUR FAVORITES
          </p>

          <h1>
            My Wishlist <Heart size={28} fill="currentColor" />
          </h1>

          <p>
            Products you've saved for later.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <Heart size={48} />

            <h2>Your wishlist is empty</h2>

            <p>
              Start adding products you love to your
              wishlist.
            </p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((product) => (
              <div
                className="wishlist-card"
                key={product.id}
              >
                {/* IMAGE */}
                <div
                  className="wishlist-image-container"
                  onClick={() => openProduct(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="wishlist-image"
                  />
                </div>

                {/* INFO */}
                <div className="wishlist-info">
                  <p className="wishlist-category">
                    {product.category}
                  </p>

                  <h3
                    onClick={() => openProduct(product)}
                  >
                    {product.name}
                  </h3>

                  <strong className="wishlist-price">
                    ₱{product.price.toLocaleString()}
                  </strong>

                  <div className="wishlist-actions">

                    {/* ADD TO CART */}
                    <button
                      type="button"
                      className="wishlist-cart-button"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart size={18} />

                      Add to Cart
                    </button>

                    {/* REMOVE */}
                    <button
                      type="button"
                      className="wishlist-remove-button"
                      onClick={() =>
                        toggleWishlist(product)
                      }
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 size={19} />
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Wishlist;