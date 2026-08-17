import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsThunk } from '../features/products/productThunks';
import { getCategoriesThunk } from '../features/categories/categoryThunks';
import ProductCard from '../components/products/ProductCard';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ✅ Hero Slides
  const slides = [
    {
      id: 1,
      title: 'Summer Sale!',
      subtitle: 'Up to 50% Off on Selected Items',
      code: 'SUMMER50',
      discount: '50% OFF',
      bg: 'from-blue-600 to-indigo-700',
      emoji: '🔥'
    },
    {
      id: 2,
      title: 'New Collection 2026',
      subtitle: 'Discover the latest fashion trends',
      code: 'NEW2026',
      discount: '30% OFF',
      bg: 'from-rose-500 to-orange-600',
      emoji: '✨'
    },
    {
      id: 3,
      title: 'Exclusive Deals',
      subtitle: 'Premium products at best prices',
      code: 'EXCLUSIVE20',
      discount: '20% OFF',
      bg: 'from-emerald-500 to-teal-600',
      emoji: '🎉'
    }
  ];

  const featuredProducts = useMemo(() => {
    if (!products?.length) return [];
    return products.filter((product) => product.isFeatured).slice(0, 8);
  }, [products]);

  const newArrivals = useMemo(() => {
    if (!products?.length) return [];
    return products.filter((product) => product.isNewArrival).slice(0, 8);
  }, [products]);

  useEffect(() => {
    dispatch(getProductsThunk({ limit: 100 }));
    dispatch(getCategoriesThunk());
  }, [dispatch]);

  // ✅ Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ✅ HERO SLIDER */}
      <section className="relative mb-12 rounded-2xl overflow-hidden shadow-xl">
        <div className={`relative bg-gradient-to-r ${slides[currentSlide].bg} text-white min-h-[380px] md:min-h-[460px] flex items-center`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 p-8 md:p-16 text-center w-full">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
              {slides[currentSlide].emoji} Limited Time Offer
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-3 tracking-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-2xl mb-6 font-light">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold text-2xl border border-white/30">
                {slides[currentSlide].discount}
              </span>
              <span className="text-white/90 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                Code: <span className="font-mono font-bold">{slides[currentSlide].code}</span>
              </span>
            </div>
            <Link
              to="/products"
              className="inline-block mt-6 bg-white text-gray-900 px-8 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Shop Now <FiArrowRight className="inline ml-2" />
            </Link>
          </div>
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/40 transition duration-300"
        >
          <FiChevronLeft size={22} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/40 transition duration-300"
        >
          <FiChevronRight size={22} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-white w-8' : 'bg-white/40 w-2'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ✅ CATEGORIES SECTION */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-800">Shop by Category</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
            View All <FiArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-400 text-sm">
              No categories available
            </div>
          ) : (
            categories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 text-center border border-gray-100 hover:border-blue-200 group"
              >
                <div className="w-full h-16 bg-gray-50 rounded-lg mb-2 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  📦
                </div>
                <p className="font-medium text-gray-700 text-sm">{category.name}</p>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ✅ FEATURED PRODUCTS */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-800">⭐ Featured</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
            View All <FiArrowRight size={16} />
          </Link>
        </div>
        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-400 text-sm">No featured products yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ✅ NEW ARRIVALS */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-800">🆕 New Arrivals</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
            View All <FiArrowRight size={16} />
          </Link>
        </div>
        {newArrivals.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
            <p className="text-gray-400 text-sm">No new arrivals yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;