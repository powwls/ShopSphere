import { useEffect, useRef, useState } from "react";
import {
  Search,
  User,
  ShoppingCart,
  Heart,
  Package,
  Settings,
  Bell,
  LogIn,
  UserPlus,
  LogOut,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const NOTIFICATIONS_KEY = "shopsphereNotifications";

function Navbar({
  cartCount,
  setIsCartOpen,
  searchTerm,
  setSearchTerm,
  setAppliedSearchTerm,
  filteredProducts,
  categories,
  setSelectedCategory,
  notifications,
  setNotifications,
  currentUser,
  setCurrentUser,
  handleLogout,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("All");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const navbarRef = useRef(null);
  const searchInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const unreadNotifications = currentUser
    ? notifications.filter((notification) => !notification.read)
    : [];
  const searchResults = filteredProducts.filter(
    (product) =>
      searchCategory === "All" || product.category === searchCategory
  );

  useEffect(() => {
    function handleOutsideInteraction(event) {
      if (navbarRef.current?.contains(event.target)) return;

      setIsSearchOpen(false);
      setIsNotificationOpen(false);
      setIsUserMenuOpen(false);
      setSearchTerm("");
    }

    function handleEscape(event) {
      if (event.key !== "Escape") return;

      setIsSearchOpen(false);
      setIsNotificationOpen(false);
      setIsUserMenuOpen(false);
      setSearchTerm("");
    }

    document.addEventListener("pointerdown", handleOutsideInteraction);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideInteraction);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [setSearchTerm]);

  function handleSearchClick() {
    const nextState = !isSearchOpen;

    setIsNotificationOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchOpen(nextState);

    if (nextState) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }

  function handleProductClick(product) {
    setSearchTerm(product.name);
    setAppliedSearchTerm(product.name);
    setSelectedCategory("All");
    navigate("/products");
    setIsSearchOpen(false);
  }

  function handleViewAll() {
    setAppliedSearchTerm(searchTerm.trim());
    setSelectedCategory(searchCategory);
    navigate("/products");
    setIsSearchOpen(false);
  }

  function handleSearchKeyDown(event) {
    if (event.key !== "Enter" || !searchTerm.trim()) return;

    event.preventDefault();
    setAppliedSearchTerm(searchTerm.trim());
    setSelectedCategory(searchCategory);
    navigate("/products");
    setIsSearchOpen(false);
  }

  function handleSearchCategoryChange(event) {
    const category = event.target.value;

    setSearchCategory(category);
    setSelectedCategory(category);
  }

  function handleNotificationClick() {
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
    setIsNotificationOpen((value) => !value);
  }

  function handleUserClick() {
    setIsSearchOpen(false);
    setIsNotificationOpen(false);
    setIsUserMenuOpen((value) => !value);
  }

  function handleWishlistClick() {
    setIsSearchOpen(false);
    setIsNotificationOpen(false);
    setIsUserMenuOpen(false);
  }

  function handleCartClick() {
    setIsSearchOpen(false);
    setIsNotificationOpen(false);
    setIsUserMenuOpen(false);
    setIsCartOpen(true);
  }

  function closeUserMenu() {
    setIsUserMenuOpen(false);
  }

  function updateNotifications(nextNotifications) {
    setNotifications(nextNotifications);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(nextNotifications));
  }

  function markAllAsRead() {
    updateNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  }

  function markNotificationAsRead(id) {
    updateNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }

  function deleteNotification(id) {
    updateNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  }

    return (
      <nav ref={navbarRef} className="navbar">
        <div className="navbar-container">
          <div className="logo">ShopSphere</div>

          <div className="nav-links">
            <Link to="/">Home</Link>
            {!isAuthPage && <Link to="/products">Products</Link>}
          </div>

          <div className="nav-icons">
            {!isAuthPage && <div className={`search-wrapper ${isSearchOpen ? "active" : ""}`}>
                <div className="navbar-search">
                  {!isSearchOpen && (
                    <button
                      type="button"
                      className="search-toggle"
                      onClick={handleSearchClick}
                      aria-label="Search products"
                    >
                      <Search size={20} />
                    </button>
                  )}
  
                  {isSearchOpen && (
                    <div className="search-container">
                      <div className="search-input-wrapper">
                        <input
                          ref={searchInputRef}
                          type="text"
                          className="search-input"
                          placeholder="Search products..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={handleSearchKeyDown}
                        />
  
                        <Search size={18} className="search-input-icon" />
                      </div>

                      <select
                        className="search-category-select"
                        value={searchCategory}
                        onChange={handleSearchCategoryChange}
                        aria-label="Filter search by category"
                      >
                        <option value="All">All categories</option>
                        {categories.map((category) => (
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
  
                      {(searchTerm.trim() !== "" || searchCategory !== "All") && (
                          <div className="search-suggestions">
                            {searchResults.length > 0 ? (
                              <>
                                {searchResults.slice(0, 4).map((product) => (
                                  <button
                                    key={product.id}
                                    type="button"
                                    className="search-suggestion-item"
                                    onClick={() => handleProductClick(product)}
                                  >
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="search-suggestion-image"
                                    />
  
                                    <div className="search-suggestion-details">
                                      <span className="search-suggestion-name" title={product.name}>
                                        {product.name || "Unnamed product"}
                                      </span>
                                      <small className="search-suggestion-price">
                                        ₱{product.price.toLocaleString()}
                                      </small>
                                    </div>
                                  </button>
                                ))}
  
                                <button
                                  type="button"
                                  className="view-all-results"
                                  onClick={handleViewAll}
                                >
                                  View all results
                                </button>
                              </>
                            ) : (
                              <div className="no-search-results">No products found.</div>
                            )}
                          </div>
                      )}
                    </div>
                  )}
                </div>
              </div>}

          {currentUser && (
          <div className="notification-wrapper">
            <button
              type="button"
              className="notification-button"
              onClick={handleNotificationClick}
              aria-label="Notifications"
            >
              <Bell size={20} />

              {unreadNotifications.length > 0 && (
                <span className="notification-badge">{unreadNotifications.length}</span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>

                  {unreadNotifications.length > 0 && (
                    <button
                      type="button"
                      className="mark-all-read"
                      onClick={markAllAsRead}
                    >
                      <CheckCheck size={15} />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">No notifications yet.</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${notification.read ? "" : "unread"}`}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        <div className="notification-content">
                          <div className="notification-title-row">
                            <h4>{notification.title}</h4>
                            {!notification.read && <span className="unread-dot" />}
                          </div>

                          <p>{notification.message}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>

                        <button
                          type="button"
                          className="delete-notification"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          aria-label="Delete notification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          )}

          <div className="user-menu-wrapper">
            <button
              type="button"
              className="user-button"
              onClick={handleUserClick}
              aria-label="User account"
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
            >
              <User size={20} />
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown" role="menu">
                {!currentUser ? (
                  <>
                    <Link
                      to="/login"
                      className="user-dropdown-item"
                      onClick={closeUserMenu}
                      role="menuitem"
                    >
                      <LogIn size={18} />
                      <span>Sign In</span>
                    </Link>

                    <Link
                      to="/signup"
                      className="user-dropdown-item"
                      onClick={closeUserMenu}
                      role="menuitem"
                    >
                      <UserPlus size={18} />
                      <span>Create Account</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="user-dropdown-profile">
                      <strong>
                        Hi, {currentUser.name?.split(" ").slice(0, 2).join(" ")}
                      </strong>
                    </div>

                    <Link
                      to="/account"
                      className="user-dropdown-item"
                      onClick={closeUserMenu}
                      role="menuitem"
                    >
                      <User size={18} />
                      <span>My Account</span>
                    </Link>

                    <Link
                      to="/orders"
                      className="user-dropdown-item"
                      onClick={closeUserMenu}
                      role="menuitem"
                    >
                      <Package size={18} />
                      <span>Order History</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      className="user-dropdown-item"
                      onClick={closeUserMenu}
                      role="menuitem"
                    >
                      <Heart size={18} />
                      <span>My Wishlist</span>
                    </Link>

                    <Link
                      to="/settings"
                      className="user-dropdown-item"
                      onClick={closeUserMenu}
                      role="menuitem"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </Link>

                    <button
                      type="button"
                      className="user-dropdown-item logout-item"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout?.();
                      }}
                      role="menuitem"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {!isAuthPage && (
            <>
              <Link
                to="/wishlist"
                className="wishlist-nav-button"
                aria-label="Wishlist"
                title="Wishlist"
                onClick={handleWishlistClick}
              >
                <Heart size={20} />
              </Link>

              <button
                type="button"
                className="cart-button"
                onClick={handleCartClick}
                aria-label="Shopping cart"
                title="Shopping cart"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && <span>{cartCount}</span>}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;