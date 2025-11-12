import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';
import { HiSparkles } from 'react-icons/hi2';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import type { GetReviewsResponse, SummarizeResponse } from './reviewsApi';
import { reviewsApi } from './reviewsApi';

type Props = {
   productId: number;
};

const ReviewList = ({ productId }: Props) => {
   const summaryMutation = useMutation<SummarizeResponse>({
      mutationFn: () => reviewsApi.summarizeReviews(productId),
   });

   const reviewsQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => reviewsApi.fetchReviews(productId),
   });

   if (reviewsQuery.isLoading) {
      return (
         <div className="flex flex-col gap-2">
            {[1, 2, 3].map((p) => (
               <div key={p} className="mb-7">
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                  <Skeleton count={4} />
               </div>
            ))}
         </div>
      );
   }

   if (reviewsQuery.error) {
      return (
         <p className="text-red-600"> Could not fetch reviews. Try again! </p>
      );
   }

   if (!reviewsQuery.data?.reviews.length) {
      return null;
   }

   const currentSummary =
      reviewsQuery.data.summary || summaryMutation.data?.summary;

   return (
      <div>
         <div className="mb-5 ">
            {currentSummary ? (
               <p className="border-2 p-3 rounded-2xl text-blue-700">
                  {currentSummary}
               </p>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <HiSparkles /> Summarize
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="flex flex-col gap-2 my-5">
                        <Skeleton count={4} />
                     </div>
                  )}
                  {summaryMutation.isError && (
                     <p className="text-red-500">
                        Could not summarize reviews. Try again!
                     </p>
                  )}
               </div>
            )}
         </div>

         <div className="flex flex-col gap-2">
            {reviewsQuery.data?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  {/* <div>Rating: {review.rating}/5</div> */}
                  <StarRating value={review.rating} />
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
