import { X, Trash2, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Cart({
  cart,
  isCartOpen,
  setIsCartOpen,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  setIsCheckoutOpen,
  currentUser,
}) {
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, product) =>
      sum + product.price * product.quantity,
    0
  );

  function handleCheckout() {
    if (cart.length === 0) {
      return;
    }

    /* NOT LOGGED IN */
    if (!currentUser) {
      setIsCartOpen(false);

      navigate("/login");

      return;
    }

    /* LOGGED IN */
    setIsCartOpen(false);

    setIsCheckoutOpen(true);
  }

  return (
    <>
      {isCartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      <aside
        className={`cart-sidebar ${
          isCartOpen ? "open" : ""
        }`}
      >
        <div className="cart-header">
          <h2>Your Cart</h2>

          <button
            className="close-cart"
            onClick={() => setIsCartOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">
              Your cart is empty 🛒
            </p>
          ) : (
            cart.map((product) => (
              <div
                className="cart-item"
                key={product.id}
              >
                <img
                  src={product.image}
                  alt={product.name}
                />

                <div className="cart-item-info">
                  <h4>
                    {product.name}
                  </h4>

                  <p>
                    ₱
                    {product.price.toLocaleString()}
                  </p>

                  {/* QUANTITY CONTROLS */}

                  <div className="quantity-controls">

                    <button
                      onClick={() =>
                        decreaseQuantity(product.id)
                      }
                    >
                      <Minus size={16} />
                    </button>

                    <span>
                      {product.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(product.id)
                      }
                    >
                      <Plus size={16} />
                    </button>

                  </div>

                  {/* SUBTOTAL */}

                  <strong className="item-subtotal">
                    Subtotal: ₱
                    {(
                      product.price *
                      product.quantity
                    ).toLocaleString()}
                  </strong>

                </div>

                <button
                  className="remove-item"
                  onClick={() =>
                    removeFromCart(product.id)
                  }
                >
                  <Trash2 size={18} />
                </button>

              </div>
            ))
          )}
        </div>

        <div className="cart-footer">

          <div className="cart-total">
            <span>
              Total
            </span>

            <strong>
              ₱{total.toLocaleString()}
            </strong>
          </div>

          {/* CHECKOUT */}

          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            Checkout
          </button>

        </div>

      </aside>
    </>
  );
}

export default Cart;