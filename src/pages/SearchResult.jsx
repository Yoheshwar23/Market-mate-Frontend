import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, useSearchParams } from "react-router";
import axios from "../utils/axiosInstance";
import { useScrollTrigger } from "../utils/useScrollTrigger";

function SearchResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  useScrollTrigger();

  // Filter states
  const [targetFilter, setTargetFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const res = await axios.get(
          `/market-mate/product/search?query=${query}`,
        );

        const apiProducts = Array.isArray(res.data?.products)
          ? res.data.products
          : [];

        setProducts(apiProducts);

        if (apiProducts.length > 0) {
          setCategory(apiProducts[0].category?.toLowerCase() || "all");
        }
      } catch (error) {
        console.error("Search fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query]);

  const handleNavigate = (id) => {
    navigate(`/market-mate/product/details/${id}`);
  };

  // Always ensure array
  const safeProducts = Array.isArray(products) ? products : [];

  // Filter and sort
  const filteredProducts = safeProducts
    .filter((product) => {
      if (targetFilter !== "all" && product.target !== targetFilter) {
        return false;
      }

      if (maxPrice && product.price > parseInt(maxPrice)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-black text-white flex flex-col">
        <Header />

        <section className="flex-1 max-w-7xl mx-auto p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white/5 animate-pulse rounded-xl"
              />
            ))}
          </div>
        </section>

        <Footer />
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-black text-white flex flex-col p-2">
      <Header />

      {/* Filter Section */}
      <section className="w-full bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Target */}
          <select
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
            className="bg-black border border-white/20 rounded-xl px-4 py-3"
          >
            <option value="all">All Targets</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>

          {/* Max price */}
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="bg-black border border-white/20 rounded-xl px-4 py-3"
          />

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-black border border-white/20 rounded-xl px-4 py-3"
          >
            <option value="default">Recommended</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          {/* Clear */}
          <button
            onClick={() => {
              setTargetFilter("all");
              setMaxPrice("");
              setSortOrder("default");
            }}
            className="border border-white/20 rounded-xl px-4 py-3 hover:bg-white/10"
          >
            Clear Filters
          </button>
        </div>
      </section>

      {/* Products */}
      <section className="flex-1 max-w-7xl mx-auto p-4 md:p-6">
        {query && (
          <h1 className="text-2xl font-bold mb-6">Results for: "{query}"</h1>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No results found
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => {
              const discount = product.discount || 0;
              const finalPrice = Math.round(
                product.price - product.price * (discount / 100),
              );

              return (
                <div
                  key={product._id}
                  onClick={() => handleNavigate(product._id)}
                  className="bg-black border border-white/10 rounded-xl p-4 cursor-pointer hover:border-white/30"
                >
                  {product.image?.base64 ? (
                    <img
                      src={`data:${product.image.contentType};base64,${product.image.base64}`}
                      alt={product.title}
                      className="w-full h-32 object-contain mb-3"
                    />
                  ) : (
                    <div className="w-full h-32 bg-white/10 flex items-center justify-center">
                      No Image
                    </div>
                  )}

                  <h3 className="text-sm font-bold line-clamp-2 mb-2">
                    {product.title}
                  </h3>

                  <div className="text-green-400 font-bold text-lg">
                    ₹{finalPrice}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

export default SearchResult;
