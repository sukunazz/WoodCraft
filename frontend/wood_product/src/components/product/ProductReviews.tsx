import React, { useState, useEffect } from "react";
import { Product } from "../../types";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import {
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getProductById,
} from "../../api/products";
import Alert from "../ui/Alert";
import Modal from "../ui/Modal";

interface ProductReviewsProps {
  product: Product;
  onReviewsUpdated: () => void; // Callback to refresh product data
}

const ProductReviews: React.FC<ProductReviewsProps> = ({
  product,
  onReviewsUpdated,
}) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>(product);

  // Effect to update currentProduct when the product prop changes
  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  const reviews = currentProduct?.ratings || [];

  // Find if the current user has already submitted a review
  const userReview = user
    ? reviews.find((review) => review.user === user._id)
    : null;

  // Initialize form with user's existing review when editing
  useEffect(() => {
    if (isEditing && userReview) {
      setRating(userReview.rating);
      setTitle(userReview.title || "");
      setComment(userReview.comment);
    }
  }, [isEditing, userReview]);

  // Function to refresh product data
  const refreshProductData = async () => {
    if (currentProduct && currentProduct._id) {
      try {
        const response = await getProductById(currentProduct._id);
        if (response.success && response.data) {
          setCurrentProduct(response.data);
        }
      } catch (error) {
        console.error("Failed to refresh product data:", error);
      }
    }
  };

  const resetForm = () => {
    setRating(5);
    setTitle("");
    setComment("");
    setShowReviewForm(false);
    setIsEditing(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reviewData = {
        rating,
        title,
        comment,
      };

      let response;

      if (isEditing) {
        response = await updateProductReview(currentProduct._id, reviewData);
      } else {
        response = await createProductReview(currentProduct._id, reviewData);
      }

      if (response.success) {
        setAlert({
          type: "success",
          message: isEditing
            ? "Your review has been updated successfully!"
            : "Your review has been submitted successfully!",
        });
        resetForm();

        // First refresh local data
        await refreshProductData();

        // Then call the parent's refresh function
        onReviewsUpdated();
      } else {
        setAlert({
          type: "error",
          message: response.error || "Failed to submit review",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred while processing your review.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = () => {
    setIsEditing(true);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async () => {
    setLoading(true);
    try {
      const response = await deleteProductReview(currentProduct._id);

      if (response.success) {
        setAlert({
          type: "success",
          message: "Your review has been deleted successfully!",
        });
        setShowDeleteModal(false);

        // First refresh local data
        await refreshProductData();

        // Then call the parent's refresh function
        onReviewsUpdated();
      } else {
        setAlert({
          type: "error",
          message: response.error || "Failed to delete review",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred while deleting your review.",
      });
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({
    rating,
    interactive = false,
    onRatingChange = null,
  }: {
    rating: number;
    interactive?: boolean;
    onRatingChange?: ((rating: number) => void) | null;
  }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={
              interactive && onRatingChange
                ? () => onRatingChange(star)
                : undefined
            }
            className={`h-5 w-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""} focus:outline-none`}
            disabled={!interactive}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 15.585l-5.257 2.764 1.003-5.852-4.254-4.143 5.879-.855L10 2.5l2.629 5.319 5.879.855-4.254 4.143 1.003 5.852L10 15.585z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString || dateString === "Unknown date") return null;

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if the user has a review to know whether to show Edit/Delete buttons
  const hasUserReview = !!userReview;

  return (
    <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Write a Review Button - For users who haven't reviewed yet */}
      {user && !hasUserReview && !showReviewForm && (
        <div className="mt-6">
          <Button
            onClick={() => {
              setShowReviewForm(true);
              setIsEditing(false);
            }}
            variant="primary"
          >
            Write a Review
          </Button>
        </div>
      )}

      {/* Not logged in message */}
      {!user && (
        <p className="mt-6 text-sm text-gray-500">
          Please{" "}
          <a href="/login" className="text-indigo-600 hover:text-indigo-500">
            log in
          </a>{" "}
          to write a review.
        </p>
      )}

      {/* Review Form - For both new reviews and editing */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmitReview}
          className="mt-6 border rounded-lg p-6 bg-gray-50"
        >
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? "Edit Your Review" : "Write Your Review"}
          </h3>

          <div className="mt-4">
            <label
              htmlFor="rating"
              className="block text-sm font-medium text-gray-700"
            >
              Rating
            </label>
            <div className="mt-1 flex items-center">
              <StarRating
                rating={rating}
                interactive={true}
                onRatingChange={setRating}
              />
              <span className="ml-2 text-sm text-gray-500">
                {rating === 1 ? "Poor" : ""}
                {rating === 2 ? "Fair" : ""}
                {rating === 3 ? "Good" : ""}
                {rating === 4 ? "Very Good" : ""}
                {rating === 5 ? "Excellent" : ""}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Review Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Summarize your review"
              required
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700"
            >
              Review
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Share your experience with this product"
              required
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={resetForm}
              variant="outline"
              className="mr-4"
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading
                ? "Submitting..."
                : isEditing
                ? "Update Review"
                : "Submit Review"}
            </Button>
          </div>
        </form>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Review"
        >
          <div className="p-6">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete your review? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteReview}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete Review"}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reviews List */}
      <div className="mt-8">
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => {
              // For current user's review, we can display their name
              const isUsersReview = user && review.user === user._id;

              // Use different display name logic based on whose review it is
              let displayName;
              if (isUsersReview && user) {
                // For the current user's review, use "You"
                displayName = "You";
              } else if (review.userName) {
                // Use the userName from the review data if available
                displayName = review.userName;
              } else {
                // Fall back to Anonymous User if userName is not available
                displayName = "Anonymous User";
              }

              // Get the formatted date or a reasonable fallback
              const reviewDate = formatDate(review.date) || "Recent";

              return (
                <div
                  key={review._id || review.id}
                  className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {review.title || "Review"}
                      </h4>
                      <div className="mt-1 flex items-center">
                        <StarRating rating={review.rating} />
                        <span className="ml-2 text-sm text-gray-500">
                          by {displayName} • {reviewDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>{review.comment}</p>
                  </div>

                  {/* Show edit/delete buttons at the bottom right if this is the user's review */}
                  {isUsersReview && (
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={handleEditReview}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="text-sm font-medium text-red-600 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg mt-4">
            <p className="text-gray-500">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
