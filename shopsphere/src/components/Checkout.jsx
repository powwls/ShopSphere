import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Trash2 } from "lucide-react";

function Checkout({
  cart,
  isCheckoutOpen,
  setIsCheckoutOpen,
  setCart,
  removeFromCart,
  addOrder,
  addNotification,
  currentUser,
}) {
  /* =========================
     ORDER STATE
  ========================= */

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [orderDetails, setOrderDetails] =
    useState(null);


  /* =========================
     SHIPPING INFORMATION
  ========================= */

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");


  /* =========================
     PAYMENT METHOD
  ========================= */

  const [paymentMethod, setPaymentMethod] =
    useState("");

  const [submitError, setSubmitError] =
    useState("");


  const navigate = useNavigate();


  /* =========================
     CALCULATE TOTAL
  ========================= */

  const total = cart.reduce(
    (sum, product) =>
      sum +
      product.price *
        product.quantity,
    0
  );


  /* =========================
     PLACE ORDER
  ========================= */

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");


    /* CHECK IF USER IS LOGGED IN */

    if (!currentUser) {
      setIsCheckoutOpen(false);

      navigate("/login");

      return;
    }


    /* CHECK IF CART IS EMPTY */

    if (cart.length === 0) {
      return;
    }


    /* =========================
       CREATE NEW ORDER
    ========================= */

    const newOrder = {
      userId: currentUser.id,
      orderNumber:
        `SS-${Date.now()}`,

      date:
        new Date().toLocaleDateString(),

      products:
        [...cart],

      total:
        total,

      /* SHIPPING INFORMATION */

      customer: {
        fullName:
          fullName,

        email:
          email,

        phone:
          phone,

        address:
          address,
      },

      /* PAYMENT */

      paymentMethod:
        paymentMethod,

      /* DELIVERY */

      estimatedDelivery:
        "3–5 Business Days",
    };


    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order: newOrder }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to place order.");
      }

      const savedOrder = data.order;

      /* SAVE SERVER ORDER TO HISTORY */

      addOrder(savedOrder);

      /* ADD NOTIFICATION */

      addNotification({
        title: "Order Placed Successfully!",
        message:
          `Your order ${
            savedOrder.orderNumber
          } worth ₱${savedOrder.total.toLocaleString()} has been received.`,
      });

      /* SHOW SUCCESS SCREEN */

      setOrderDetails(savedOrder);
      setOrderPlaced(true);
      setCart([]);
    } catch (error) {
      setSubmitError(error.message || "Unable to place order.");
    }
  }


  /* =========================
     CLOSE CHECKOUT
  ========================= */

  function handleClose() {
    setIsCheckoutOpen(
      false
    );

    setOrderPlaced(
      false
    );

    setOrderDetails(
      null
    );

    setPaymentMethod(
      ""
    );

    setSubmitError("");


    /* RESET SHIPPING FORM */

    setFullName(
      ""
    );

    setEmail(
      ""
    );

    setPhone(
      ""
    );

    setAddress(
      ""
    );
  }


  /* =========================
     DON'T RENDER IF CLOSED
  ========================= */

  if (!isCheckoutOpen) {
    return null;
  }


  return (
    <div
      className="checkout-overlay"
      onClick={handleClose}
    >
      <div
        className="checkout-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* CLOSE BUTTON */}

        <button
          type="button"
          className="checkout-close"
          onClick={handleClose}
          aria-label="Close checkout"
        >
          <X size={24} />
        </button>


        {/* =========================
            ORDER SUCCESS
        ========================= */}

        {orderPlaced &&
        orderDetails ? (

          <div className="order-success">

            <div className="success-icon">
              ✓
            </div>


            <h2>
              Order Placed Successfully!
            </h2>


            <p>
              Thank you for shopping with
              ShopSphere. Your order has been
              received.
            </p>


            <div className="order-confirmation-details">


              {/* ORDER NUMBER */}

              <div className="order-detail-row">

                <span>
                  Order Number
                </span>

                <strong>
                  {
                    orderDetails.orderNumber
                  }
                </strong>

              </div>


              {/* PAYMENT METHOD */}

              <div className="order-detail-row">

                <span>
                  Payment Method
                </span>

                <strong>
                  {
                    orderDetails.paymentMethod
                  }
                </strong>

              </div>


              {/* DELIVERY */}

              <div className="order-detail-row">

                <span>
                  Estimated Delivery
                </span>

                <strong>
                  {
                    orderDetails
                      .estimatedDelivery
                  }
                </strong>

              </div>


              {/* SHIPPING INFORMATION */}

              <div className="confirmation-shipping">

                <h3>
                  Shipping Information
                </h3>


                <div className="shipping-detail">

                  <span>
                    Full Name
                  </span>

                  <strong>
                    {
                      orderDetails
                        .customer
                        .fullName
                    }
                  </strong>

                </div>


                <div className="shipping-detail">

                  <span>
                    Email
                  </span>

                  <strong>
                    {
                      orderDetails
                        .customer
                        .email
                    }
                  </strong>

                </div>


                <div className="shipping-detail">

                  <span>
                    Phone
                  </span>

                  <strong>
                    {
                      orderDetails
                        .customer
                        .phone
                    }
                  </strong>

                </div>


                <div className="shipping-detail shipping-address">

                  <span>
                    Shipping Address
                  </span>

                  <strong>
                    {
                      orderDetails
                        .customer
                        .address
                    }
                  </strong>

                </div>

              </div>


              {/* PRODUCTS */}

              <div className="confirmation-products">

                <h3>
                  Your Order
                </h3>


                {orderDetails.products.map(
                  (product) => (

                    <div
                      className="confirmation-product"
                      key={product.id}
                    >

                      <span>

                        {
                          product.name
                        }

                        {" × "}

                        {
                          product.quantity
                        }

                      </span>


                      <strong>

                        ₱

                        {(
                          product.price *
                          product.quantity
                        ).toLocaleString()}

                      </strong>

                    </div>

                  )
                )}

              </div>


              {/* TOTAL */}

              <div className="confirmation-total">

                <span>
                  Total Paid
                </span>

                <strong>

                  ₱

                  {
                    orderDetails
                      .total
                      .toLocaleString()
                  }

                </strong>

              </div>

            </div>


            {/* CONTINUE SHOPPING */}

            <button
              type="button"
              className="continue-shopping"
              onClick={handleClose}
            >

              Continue Shopping

            </button>

          </div>

        ) : (

          /* =========================
             CHECKOUT FORM
          ========================= */

          <>

            <h2>
              Checkout
            </h2>


            <div className="checkout-content">


              {/* =========================
                  CHECKOUT FORM
              ========================= */}

              <form
                className="checkout-form"
                onSubmit={handleSubmit}
              >

                {submitError && (
                  <p className="auth-error">
                    {submitError}
                  </p>
                )}

                <h3>
                  Shipping Information
                </h3>


                {/* FULL NAME */}

                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(
                      e.target.value
                    )
                  }
                  required
                />


                {/* EMAIL */}

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />


                {/* PHONE */}

                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  required
                />


                {/* ADDRESS */}

                <textarea
                  placeholder="Complete Shipping Address"
                  rows="4"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  required
                />


                {/* PAYMENT METHOD */}

                <h3>
                  Payment Method
                </h3>


                <select
                  required
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Payment Method
                  </option>


                  <option value="Cash on Delivery">
                    Cash on Delivery
                  </option>


                  <option value="GCash">
                    GCash
                  </option>


                  <option value="Credit / Debit Card">
                    Credit / Debit Card
                  </option>

                </select>


                {/* PLACE ORDER */}

                <button
                  type="submit"
                  className="place-order-button"
                  disabled={
                    cart.length === 0
                  }
                >

                  {cart.length === 0
                    ? "Your Cart is Empty"
                    : `Place Order — ₱${total.toLocaleString()}`}

                </button>

              </form>


              {/* =========================
                  ORDER SUMMARY
              ========================= */}

              <div className="checkout-summary">

                <h3>
                  Order Summary
                </h3>


                {cart.length === 0 ? (

                  <p className="empty-checkout">
                    Your cart is empty.
                  </p>

                ) : (

                  <>

                    {cart.map(
                      (product) => (

                        <div
                          className="checkout-product"
                          key={product.id}
                        >

                          <div className="checkout-product-info">

                            <span>

                              {
                                product.name
                              }

                              {" × "}

                              {
                                product.quantity
                              }

                            </span>


                            <strong>

                              ₱

                              {(
                                product.price *
                                product.quantity
                              ).toLocaleString()}

                            </strong>

                          </div>


                          <button
                            type="button"
                            className="checkout-remove"
                            onClick={(e) => {

                              e.preventDefault();

                              e.stopPropagation();

                              removeFromCart(
                                product.id
                              );

                            }}
                            aria-label={`Remove ${product.name}`}
                          >

                            <Trash2 size={18} />

                          </button>

                        </div>

                      )
                    )}


                    {/* TOTAL */}

                    <div className="checkout-total">

                      <span>
                        Total
                      </span>


                      <strong>

                        ₱

                        {
                          total.toLocaleString()
                        }

                      </strong>

                    </div>

                  </>

                )}

              </div>

            </div>

          </>

        )}

      </div>

    </div>
  );
}

export default Checkout;