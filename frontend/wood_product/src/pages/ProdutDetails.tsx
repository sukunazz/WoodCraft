import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { getProductById, createProductReview } from "../api/products";
import { Product, ReviewFormData } from "../types";

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Check if user is logged in
  const userInfo = localStorage.getItem("userInfo");
  const isLoggedIn = !!userInfo;
  const user = isLoggedIn ? JSON.parse(userInfo) : null;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      setLoading(true);
      const response = await getProductById(id);

      if (response.success && response.data) {
        setProduct(response.data);
        setError(null);
      } else {
        setError(response.error || "Failed to fetch product details");
        setProduct(null);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const addToCartHandler = () => {
    if (!product) return;
    // Implement cart functionality here
    alert(`Added ${quantity} of ${product.name} to cart`);
  };

  const submitReviewHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;
    setReviewError(null);

    if (rating === 0) {
      setReviewError("Please select a rating");
      return;
    }

    const reviewData: ReviewFormData = {
      rating,
      comment,
    };

    const response = await createProductReview(id, reviewData);

    if (response.success) {
      setReviewSubmitted(true);
      setRating(0);
      setComment("");
      // Refresh product data to show the new review
      const updatedProduct = await getProductById(id);
      if (updatedProduct.success && updatedProduct.data) {
        setProduct(updatedProduct.data);
      }
    } else {
      setReviewError(response.error || "Failed to submit review");
    }
  };

  // Function to render stars based on rating
  const renderStars = (value: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          if (star <= value) {
            return <FaStar key={star} className="text-yellow-500" />;
          } else if (star - 0.5 <= value) {
            return <FaStarHalfAlt key={star} className="text-yellow-500" />;
          } else {
            return <FaRegStar key={star} className="text-yellow-500" />;
          }
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || "Product not found"}</p>
          <Link
            to="/"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  // Ensure countInStock is valid for array creation
  const stockCount =
    product.countInStock && product.countInStock > 0
      ? Math.min(product.countInStock, 10)
      : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            {renderStars(product.rating)}
            <span className="ml-2 text-gray-600">
              {product.rating.toFixed(1)} ({product.numReviews} reviews)
            </span>
          </div>

          <div className="border-t border-b py-4 my-4">
            <div className="flex justify-between text-lg mb-2">
              <span className="font-semibold">Price:</span>
              <span className="text-xl font-bold text-blue-700">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="font-semibold">Status:</span>
              <span
                className={
                  product.countInStock > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {stockCount > 0 && (
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Quantity:</span>
                <select
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border rounded px-2 py-1"
                >
                  {[...Array(stockCount).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description:</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <button
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            className={`w-full py-3 px-4 rounded font-semibold ${
              product.countInStock > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 cursor-not-allowed text-gray-500"
            }`}
          >
            {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {/* Display existing reviews */}
        <div className="mb-8">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 mb-4">
                <div className="flex items-center mb-2">
                  <span className="font-semibold mr-2">{review.name}</span>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No reviews yet</p>
          )}
        </div>

        {/* Write a review section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

          {!isLoggedIn ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <p>
                Please{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  sign in
                </Link>{" "}
                to write a review
              </p>
            </div>
          ) : reviewSubmitted ? (
            <div className="bg-green-50 border border-green-200 p-4 rounded">
              <p className="text-green-700">Thank you for your review!</p>
            </div>
          ) : (
            <form onSubmit={submitReviewHandler}>
              {reviewError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <p>{reviewError}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-2 font-medium">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl mr-1 focus:outline-none"
                    >
                      {star <= rating ? (
                        <FaStar className="text-yellow-500" />
                      ) : (
                        <FaRegStar className="text-yellow-500" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="comment" className="block mb-2 font-medium">
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border rounded py-2 px-3 min-h-32"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded font-semibold"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
