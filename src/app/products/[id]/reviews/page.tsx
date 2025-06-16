import { useProduct } from "@/hooks/useProduct";
import { useParams } from "next/navigation";
import { RatingStars } from "@/components/ui/rating-stars";

export default function ProductReviewsPage() {
  const params = useParams();
  const { data: product, isLoading } = useProduct(params.id as string);

  if (isLoading || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex items-center gap-2">
          <RatingStars rating={product.averageRating} size="lg" />
          <span className="text-lg text-muted-foreground">
            ({product.totalRatings}{" "}
            {product.totalRatings === 1 ? "avaliação" : "avaliações"})
          </span>
        </div>

        <div className="space-y-6">
          {product.reviews.map((review) => (
            <div key={review.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <RatingStars rating={review.rating} size="sm" />
                <span className="text-sm text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <p className="text-sm text-gray-500">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
