import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";


import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import ProductDetails from "./components/ProductDetails";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import OrderHistory from "./components/OrderHistory";
import Wishlist from "./components/Wishlist";
import Account from "./components/Account";
import Settings from "./components/Settings";
import { products as catalogProducts } from "./data/products";

const API_BASE_URL = "http://localhost:5000/api";

function InfoPage({ title, subtitle, children }) {
  return (
    <section className="info-page">
      <div className="info-page-container">
        <p className="section-subtitle">SHOPSPHERE INFORMATION</p>
        <h1>{title}</h1>
        <p className="info-page-subtitle">{subtitle}</p>
        <div className="info-page-content">{children}</div>
      </div>
    </section>
  );
}

function App() {
  /* =========================
     CURRENT USER
  ========================= */

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("shopsphereCurrentUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [products, setProducts] = useState(catalogProducts);

  /* =========================
     USER DATA
  ========================= */

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  /*
    Prevents the empty state from immediately
    overwriting localStorage before user data loads.
  */
  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);

  /* =========================
     NOTIFICATIONS
  ========================= */

  const [notifications, setNotifications] = useState([]);

  /* =========================
     NAVIGATION
  ========================= */

  const navigate = useNavigate();

  /* =========================
     MODALS
  ========================= */

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /* =========================
     SEARCH
  ========================= */

  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");

  /* =========================
     PRODUCT FILTERS
  ========================= */

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");

  /* =========================
     PRODUCT DETAILS
  ========================= */

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductOpen, setIsProductOpen] = useState(false);

  /* =========================
     SAVE CURRENT USER
  ========================= */

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        "shopsphereCurrentUser",
        JSON.stringify(currentUser)
      );
    } else {
      localStorage.removeItem("shopsphereCurrentUser");
    }
  }, [currentUser]);

  /* =========================
     LOAD USER DATA
  ========================= */

  useEffect(() => {
    // Prevent saving while switching users or loading data.
    setIsUserDataLoaded(false);

    if (!currentUser) {
      setCart([]);
      setWishlist([]);
      setOrders([]);
      setNotifications([]);
      setIsUserDataLoaded(true);

      return;
    }

    async function loadUserData() {
      try {
        const [cartResponse, wishlistResponse, notificationsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/user-data/${currentUser.id}/cart`),
            fetch(`${API_BASE_URL}/user-data/${currentUser.id}/wishlist`),
            fetch(`${API_BASE_URL}/user-data/${currentUser.id}/notifications`),
          ]);

        const [userCart, userWishlist, savedNotifications] = await Promise.all([
          cartResponse.json(),
          wishlistResponse.json(),
          notificationsResponse.json(),
        ]);

        setCart(userCart || []);
        setWishlist(userWishlist || []);
        setNotifications(
          savedNotifications || [
            {
              id: Date.now(),
              title: "Welcome to ShopSphere!",
              message: "Start exploring gaming gear for your setup.",
              time: "Just now",
              read: false,
            },
          ]
        );
      } catch (error) {
        console.error("Unable to load user data:", error);
        setCart([]);
        setWishlist([]);
        setNotifications([]);
      } finally {
        setIsUserDataLoaded(true);
      }
    }

    loadUserData();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    async function fetchOrders() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/${currentUser.id}`
        );

        if (!response.ok) {
          throw new Error("Could not fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Using local order history:", error);
      }
    }

    fetchOrders();
  }, [currentUser]);

  /* =========================
     SAVE USER DATA
  ========================= */

  useEffect(() => {
    if (!currentUser || !isUserDataLoaded) return;

    fetch(`${API_BASE_URL}/user-data/${currentUser.id}/cart`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cart),
    }).catch((error) => console.error("Unable to save cart:", error));
  }, [cart, currentUser, isUserDataLoaded]);

  useEffect(() => {
    if (!currentUser || !isUserDataLoaded) return;

    fetch(`${API_BASE_URL}/user-data/${currentUser.id}/wishlist`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wishlist),
    }).catch((error) => console.error("Unable to save wishlist:", error));
  }, [wishlist, currentUser, isUserDataLoaded]);

  /* =========================
     SAVE NOTIFICATIONS
  ========================= */

  useEffect(() => {
    if (!currentUser || !isUserDataLoaded) return;

    fetch(`${API_BASE_URL}/user-data/${currentUser.id}/notifications`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notifications),
    }).catch((error) => console.error("Unable to save notifications:", error));
  }, [notifications, currentUser, isUserDataLoaded]);

  /* =========================
     CATEGORIES
  ========================= */

  const categories = [
    {
      name: "Gaming PCs",
      icon: "🖥️",
    },
    {
      name: "Monitors",
      icon: "🎯",
    },
    {
      name: "Keyboards",
      icon: "⌨️",
    },
    {
      name: "Mice",
      icon: "🖱️",
    },
    {
      name: "Audio",
      icon: "🎧",
    },
    {
      name: "Desk Setup",
      icon: "💡",
    },
  ];

  /* =========================
     SEARCH
  ========================= */

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
    );
  }, [products, searchTerm]);

  /* =========================
     PRODUCT FILTERING
  ========================= */

  const categoryFilteredProducts = products
    .filter((product) => {
      const search = appliedSearchTerm.trim().toLowerCase();
      const searchMatch =
        search === "" ||
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search);

      const categoryMatch =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const minPriceMatch =
        minPrice === "" || product.price >= Number(minPrice);

      const maxPriceMatch =
        maxPrice === "" || product.price <= Number(maxPrice);

      return searchMatch && categoryMatch && minPriceMatch && maxPriceMatch;
    })
    .sort((a, b) => {
      if (sortOption === "low-high") {
        return a.price - b.price;
      }

      if (sortOption === "high-low") {
        return b.price - a.price;
      }

      if (sortOption === "name-az") {
        return a.name.localeCompare(b.name);
      }

      if (sortOption === "name-za") {
        return b.name.localeCompare(a.name);
      }

      return 0;
    });

  /* =========================
     CART FUNCTIONS
  ========================= */

  function addToCart(product) {
    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  }

  function increaseQuantity(productId) {
    setCart(
      cart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(productId) {
    setCart(
      cart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter(
        (product) => product.id !== productId
      )
    );
  }

  /* =========================
     PRODUCT DETAILS
  ========================= */

  function openProduct(product) {
    setSelectedProduct(product);
    setIsProductOpen(true);
  }

  /* =========================
     ORDERS
  ========================= */

  function addOrder(order) {
    setOrders((currentOrders) => [
      order,
      ...currentOrders,
    ]);
  }

  /* =========================
     WISHLIST
  ========================= */

  function toggleWishlist(product) {
    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some(
        (item) => item.id === product.id
      );

      if (exists) {
        return currentWishlist.filter(
          (item) => item.id !== product.id
        );
      }

      return [...currentWishlist, product];
    });
  }

  /* =========================
     CART COUNT
  ========================= */

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  /* =========================
     NOTIFICATIONS
  ========================= */

  function addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      title: notification.title,
      message: notification.message,
      time: "Just now",
      read: false,
    };

    setNotifications((currentNotifications) => [
      newNotification,
      ...currentNotifications,
    ]);
  }

  /* =========================
     LOGOUT
  ========================= */

  function handleLogout() {
    setIsCartOpen(false);
    setIsCheckoutOpen(false);

    localStorage.removeItem("shopsphereCurrentUser");

    setCurrentUser(null);
    setNotifications([]);

    navigate("/login");
  }

  return (
    <>
      <Navbar
        cartCount={cartCount}
        setIsCartOpen={setIsCartOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setAppliedSearchTerm={setAppliedSearchTerm}
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        products={products}
        filteredProducts={filteredProducts}
        notifications={notifications}
        setNotifications={setNotifications}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        handleLogout={handleLogout}
      />

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Hero />

              {/* FEATURED COLLECTIONS */}
              <section className="home-collections">
                <div className="section-header">
                  <p className="section-subtitle">CURATED FOR YOUR SETUP</p>

                  <h2>Shop the latest picks</h2>

                  <p>
                    Hand-picked upgrades for faster play, cleaner desks, and better sessions.
                  </p>
                </div>

                <div className="home-collections-grid">
                  {products.slice(0, 3).map((product, index) => (
                    <button
                      key={product.id}
                      type="button"
                      className={`home-collection-card collection-card-${index + 1}`}
                      onClick={() => openProduct(product)}
                    >
                      <img src={product.image} alt={product.name} />
                      <span className="home-collection-overlay" />
                      <span className="home-collection-content">
                        <small>{product.category}</small>
                        <strong>{product.name}</strong>
                        <span className="home-collection-price">
                          ₱{product.price.toLocaleString()}
                          <span aria-hidden="true">→</span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section id="setup-builder" className="setup-builder">
                <div className="setup-builder-copy">
                  <p className="section-subtitle">BUILD YOUR SETUP</p>
                  <h2>Start with the way you play.</h2>
                  <p>
                    Pick a setup direction and we&apos;ll take you straight to
                    the gear that belongs together.
                  </p>
                </div>

                <div className="setup-builder-options">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("Gaming PCs");
                      navigate("/products");
                    }}
                  >
                    <span>🎮</span>
                    <strong>Gaming Setup</strong>
                    <small>PCs, monitors, and performance gear</small>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory("Desk Setup");
                      navigate("/products");
                    }}
                  >
                    <span>✨</span>
                    <strong>Work Setup</strong>
                    <small>Clean desks, lighting, and productivity gear</small>
                  </button>
                </div>
              </section>

              <section className="store-benefits" aria-label="ShopSphere benefits">
                <div className="benefit-item">
                  <span className="benefit-number">01</span>
                  <div>
                    <h3>Curated performance gear</h3>
                    <p>Only the pieces that deserve a place on your setup.</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-number">02</span>
                  <div>
                    <h3>Gear that works together</h3>
                    <p>Build a clean, compatible battlestation with confidence.</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-number">03</span>
                  <div>
                    <h3>Fast, reliable delivery</h3>
                    <p>Get your next upgrade moving from cart to desk quickly.</p>
                  </div>
                </div>
              </section>

              {/* FEATURED PRODUCTS */}
              <section className="products-section">
                <div className="section-header">
                  <p className="section-subtitle">
                    LEVEL UP YOUR SETUP
                  </p>

                  <h2>Featured Products</h2>

                  <p>
                    Hand-picked gear for sharper play, cleaner desks, and better sessions.
                  </p>
                </div>

                <div className="products-grid">
                  {products.slice(0, 4).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                      openProduct={openProduct}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              </section>
            </>
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            <Products
              products={categoryFilteredProducts}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sortOption={sortOption}
              setSortOption={setSortOption}
              addToCart={addToCart}
              openProduct={openProduct}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
            />
          }
        />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Wishlist
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                addToCart={addToCart}
                openProduct={openProduct}
              />
            </ProtectedRoute>
          }
        />

        {/* ACCOUNT */}
        <Route
          path="/account"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Account currentUser={currentUser} />
            </ProtectedRoute>
          }
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <Settings
                currentUser={currentUser}
                setCart={setCart}
                setWishlist={setWishlist}
                setCurrentUser={setCurrentUser}
              />
            </ProtectedRoute>
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <Login setCurrentUser={setCurrentUser} />
          }
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* FORGOT PASSWORD */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* ORDERS */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute currentUser={currentUser}>
              <OrderHistory orders={orders} />
            </ProtectedRoute>
          }
        />

        {/* FOOTER INFORMATION PAGES */}
        <Route
          path="/about"
          element={
            <InfoPage title="About Me" subtitle="A better way to build your setup.">
              <p>ShopSphere helps gamers, creators, and work-from-home users find reliable gear for a better everyday setup.</p>
              <p>We focus on practical products, clear choices, and a smooth shopping experience.</p>
            </InfoPage>
          }
        />
        <Route
          path="/faqs"
          element={
            <InfoPage title="FAQs" subtitle="Answers to common questions.">
              <h2>How do I place an order?</h2>
              <p>Add your items to the cart, continue to checkout, and complete the order form.</p>
              <h2>Can I update my account?</h2>
              <p>Yes. Sign in and open My Account to update your profile details.</p>
            </InfoPage>
          }
        />
        <Route
          path="/contact"
          element={
            <InfoPage title="Contact Us" subtitle="We are here to help.">
              <p>For questions about products, orders, or your account, contact us at:</p>
              <p><strong>Email:</strong> support@shopsphere.com</p>
              <p><strong>Hours:</strong> Monday–Friday, 9:00 AM–6:00 PM</p>
            </InfoPage>
          }
        />
        <Route
          path="/terms"
          element={
            <InfoPage title="Terms of Service" subtitle="Please read these terms before using ShopSphere.">
              <p>By using ShopSphere, you agree to provide accurate information and use the service lawfully.</p>
              <p>Product availability, prices, and delivery details may change without prior notice.</p>
            </InfoPage>
          }
        />
        <Route
          path="/privacy"
          element={
            <InfoPage title="Privacy Policy" subtitle="Your privacy matters to us.">
              <p>We use your account and order information only to provide, improve, and secure the ShopSphere service.</p>
              <p>We do not sell your personal information. Contact us if you have questions about your data.</p>
            </InfoPage>
          }
        />
      </Routes>

      {/* CART */}
      <Cart
        cart={cart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        setIsCheckoutOpen={setIsCheckoutOpen}
        currentUser={currentUser}
      />

      {/* CHECKOUT */}
      <Checkout
        cart={cart}
        isCheckoutOpen={isCheckoutOpen}
        setIsCheckoutOpen={setIsCheckoutOpen}
        setCart={setCart}
        removeFromCart={removeFromCart}
        addOrder={addOrder}
        addNotification={addNotification}
        currentUser={currentUser}
      />

      {/* PRODUCT DETAILS */}
      <ProductDetails
        product={selectedProduct}
        isProductOpen={isProductOpen}
        setIsProductOpen={setIsProductOpen}
        addToCart={addToCart}
      />

      <footer className="store-footer">
        <div className="store-footer-main">
          <div className="store-footer-brand">
            <div className="logo">ShopSphere</div>
            <strong className="store-footer-about-title">About Me</strong>
            <p>Better gear for better play, work, and everyday focus.</p>
          </div>
          <div className="store-footer-links">
            <div>
              <strong>About</strong>
              <Link to="/about">About Me</Link>
              <Link to="/faqs">FAQs</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
            <div>
              <strong>Legal</strong>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div className="store-footer-bottom">
          <span>© 2026 ShopSphere</span>
          <span>Built for better setups.</span>
        </div>
      </footer>
    </>
  );
}

export default App;