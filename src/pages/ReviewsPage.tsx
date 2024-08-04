import React from "react";
import Sidebar from "../layout/Sidebar";
import PageHeader from "@/components/PageHeader";
import { useParams } from "react-router-dom";
import { useGetApartmentReviewsQuery } from "@/api/api";
import { formatDateString } from "@/utils/functions";
import { FaQuoteRight } from "react-icons/fa";

const ReviewsPage = () => {
  const { apartmentId } = useParams();
  if (!apartmentId) return null;

  const { data: reviews } = useGetApartmentReviewsQuery(apartmentId);

  return (
    <Sidebar>
      <PageHeader title={"Reviews"} entriesNumber={reviews?.length} />
      <>
        {reviews?.length && (
          <div className={"reviews"}>
            {reviews.map((review) => {
              return (
                <div key={review.reviewId} className={"reviews__review"}>
                  <div className={"reviews__review__header"}>
                    <span className={"reviews__review__header__client"}>
                      {review.reservation.clientName}
                    </span>
                    <span className={"reviews__review__header__date"}>
                      {formatDateString(review.createdAt.toString())}
                    </span>
                  </div>
                  <div className={"reviews__review__ratings"}>
                    <div className={"reviews__review__ratings__container"}>
                      <div
                        className={"reviews__review__ratings__container__type"}
                      >
                        Comfort
                      </div>
                      <div
                        className={
                          "reviews__review__ratings__container__rating"
                        }
                      >
                        {review.comfortRating}/5
                      </div>
                    </div>
                    <div className={"reviews__review__ratings__container"}>
                      <div
                        className={"reviews__review__ratings__container__type"}
                      >
                        Value for money
                      </div>
                      <div
                        className={
                          "reviews__review__ratings__container__rating"
                        }
                      >
                        {review.valueRating}/5
                      </div>
                    </div>
                    <div className={"reviews__review__ratings__container"}>
                      <div
                        className={"reviews__review__ratings__container__type"}
                      >
                        Overall
                      </div>
                      <div
                        className={
                          "reviews__review__ratings__container__rating"
                        }
                      >
                        {review.experienceRating}/5
                      </div>
                    </div>
                  </div>
                  {review.review.length && (
                    <div className={"reviews__review__text"}>
                      <div className={"reviews__review__text__icon"}>
                        <FaQuoteRight size={20} color={"#adb5bd"} />
                      </div>
                      <div className={"reviews__review__text__textBody"}>
                        {review.review}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </>
    </Sidebar>
  );
};

export default ReviewsPage;
