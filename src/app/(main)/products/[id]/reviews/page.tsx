"use client";

import { useProduct } from "@/hooks/useProduct";
import { useParams } from "next/navigation";
import { RatingStars } from "@/components/ui/rating-stars";

export default function ProductReviewsPage() {
  const params = useParams();
  const { data: product, isLoading } = useProduct(params.id as string);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6 mt-1"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Avaliações - {product.name}</h1>
        <div className="flex items-center space-x-4">
          <RatingStars rating={product.averageRating} />
          <span className="text-muted-foreground">
            {product.totalRatings} avaliações
          </span>
        </div>
      </div>

      {product.reviews.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">
            Nenhuma avaliação ainda
          </h3>
          <p className="text-muted-foreground">
            Seja o primeiro a avaliar este produto!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {product.reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {review.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{review.user.name}</h4>
                  <div className="flex items-center space-x-2">
                    <RatingStars rating={review.rating} />
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
              {review.content && (
                <p className="text-gray-700">{review.content}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
