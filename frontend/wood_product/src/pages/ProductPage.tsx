import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getProducts } from "../api/products";
import { Product } from "../types";
import Loading from "../components/ui/Loading";
import ProductDetails from "../components/product/ProductDetails";
import ProductReviews from "../components/product/ProductReviews";
import RelatedProducts from "../components/product/RelatedProducts";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("Product ID is missing");

        const response = await getProductById(id);

        if (!response.success || !response.data) {
          const errorMessage = response.success
            ? "Failed to load product details"
            : response.error;
          throw new Error(errorMessage || "Failed to load product details");
        }

        setProduct(response.data);

        // Fetch related products based on category
        if (response.data.category) {
          const relatedResponse = await getProducts(
            "",
            1,
            response.data.category
          );
          if (relatedResponse.success) {
            setRelatedProducts(relatedResponse.data.items);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load product details. Please try again.";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handler to refresh product data after review updates
  const handleReviewsUpdated = async () => {
    if (!id) return;

    try {
      const response = await getProductById(id);
      if (response.success && response.data) {
        setProduct(response.data);
      }
    } catch (err) {
      console.error("Failed to refresh product data:", err);
    }
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-600">
          The product you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="container mx-auto px-4 py-8">
        {/* Product Details Component */}
        <ProductDetails product={product} />

        {/* Product Reviews Component */}
        <ProductReviews
          product={product}
          onReviewsUpdated={handleReviewsUpdated}
        />

        {/* Related Products Component */}
        <RelatedProducts
          currentProductId={product._id}
          products={relatedProducts}
        />
      </div>
    </div>
  );
};

export default ProductPage;
