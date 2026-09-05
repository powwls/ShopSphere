import { useState } from "react";
import ProductCard from "./ProductCard";

function Products({
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortOption,
  setSortOption,
  addToCart,
  openProduct,
  wishlist,
  toggleWishlist,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const pageCount = Math.ceil(products.length / productsPerPage);

  const productsToShow = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  function resetFilters() {
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSortOption("");
    setCurrentPage(1);
  }

  return (
    <section className="all-products-page">
      <div className="products-page-container">

        {/* FILTER SIDEBAR */}
        <aside className="products-filter">
          <div className="filter-title">
            <h2>Filters</h2>

            <button
              type="button"
              onClick={resetFilters}
              className="reset-filter"
            >
              Reset
            </button>
          </div>

          {/* CATEGORIES */}
          <div className="filter-group">
            <h3>Categories</h3>

            <label className="filter-option">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === "All"}
                onChange={() => {
                  setSelectedCategory("All");
                  setCurrentPage(1);
                }}
              />

              <span>All Products</span>
            </label>

            {categories.map((category) => (
              <label
                className="filter-option"
                key={category.name}
              >
                <input
                  type="radio"
                  name="category"
                  checked={
                    selectedCategory === category.name
                  }
                  onChange={() => {
                    setSelectedCategory(category.name);
                    setCurrentPage(1);
                  }}
                />

                <span>{category.name}</span>
              </label>
            ))}
          </div>

          {/* PRICE RANGE */}
          <div className="filter-group price-filter">
            <h3>Price Range</h3>

            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setCurrentPage(1);
              }}
            />

            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </aside>

        {/* PRODUCTS CONTENT */}
        <main className="all-products-content">

          <div className="products-page-header">
            <div>
              <p className="section-subtitle">
                SHOP OUR COLLECTION
              </p>

              <h1>All Products</h1>

              <p>
                Browse our collection and find
                products you love.
              </p>
            </div>

            {/* SORT */}
            <div className="products-controls">
              <span className="products-count">
                {products.length} Products
              </span>

              <select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">
                  Sort By
                </option>

                <option value="low-high">
                  Price: Low to High
                </option>

                <option value="high-low">
                  Price: High to Low
                </option>

                <option value="name-az">
                  Name: A to Z
                </option>

                <option value="name-za">
                  Name: Z to A
                </option>
              </select>
            </div>
          </div>

          {/* PRODUCTS */}
          {products.length > 0 ? (
            <>
              <div className="all-products-grid">
                {productsToShow.map((product) => (
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

              {pageCount > 1 && (
                <div className="pagination" aria-label="Product pages">
                  <button
                    type="button"
                    className="pagination-button"
                    onClick={() => setCurrentPage((page) => page - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    &lt;
                  </button>

                  {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        className={`pagination-button ${
                          currentPage === page ? "active" : ""
                        }`}
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? "page" : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    className="pagination-button"
                    onClick={() => setCurrentPage((page) => page + 1)}
                    disabled={currentPage === pageCount}
                    aria-label="Next page"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-products">
              <h3>No products found</h3>

              <p>
                Try changing or resetting your
                filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          )}

        </main>

      </div>
    </section>
  );
}

export default Products;