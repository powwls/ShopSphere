import { useNavigate } from "react-router-dom";

function OrderHistory({ orders }) {
  const navigate = useNavigate();

  return (
    <section className="order-history-page">
      <div className="order-history-container">

        {/* HEADER */}

        <div className="order-history-header">

          <div>

            <p className="section-subtitle">
              YOUR PURCHASES
            </p>

            <h1>
              Order History
            </h1>

            <p>
              View all your previous orders.
            </p>

          </div>


          <button
            type="button"
            className="close-orders-button"
            onClick={() => navigate("/")}
          >
            Back to Shop
          </button>

        </div>


        {/* EMPTY ORDERS */}

        {orders.length === 0 ? (

          <div className="empty-orders">

            <div className="empty-orders-icon">
              📦
            </div>

            <h2>
              No Orders Yet
            </h2>

            <p>
              You haven't placed any orders yet.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
            >
              Start Shopping
            </button>

          </div>

        ) : (

          /* ORDERS LIST */

          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order.orderNumber}
              >

                {/* ORDER HEADER */}

                <div className="order-card-header">

                  <div>

                    <span className="order-label">
                      ORDER NUMBER
                    </span>

                    <h3>
                      {order.orderNumber}
                    </h3>

                  </div>


                  <span className="order-status">
                    Processing
                  </span>

                </div>


                {/* ORDER DATE */}

                <div className="order-date">

                  Ordered on {order.date}

                </div>


                {/* PRODUCTS */}

                <div className="order-products">

                  {order.products.map(
                    (product) => (

                      <div
                        className="order-history-product"
                        key={product.id}
                      >

                        <span>

                          {product.name} ×{" "}

                          {product.quantity}

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


                {/* PAYMENT */}

                <div className="order-payment">

                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {order.paymentMethod}
                  </strong>

                </div>


                {/* TOTAL */}

                <div className="order-history-total">

                  <span>
                    Total
                  </span>

                  <strong>

                    ₱
                    {order.total.toLocaleString()}

                  </strong>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </section>
  );
}

export default OrderHistory;