import React from "react";
import { IReview } from "../interfaces/NewItemInterface";

export const ReviewItem = ({
  id,
  review,
  timestamp,
  comfortRating,
  experienceRating,
  valueRating,
}: IReview) => {
  const toDateTime = (secs: number) => {
    let t = new Date(Date.UTC(1970, 0, 1)); // Epoch
    t.setUTCSeconds(secs);
    return t;
  };
  return (
    <div className="rounded shadow-sm p-2 mb-3">
      <div className="d-flex justify-content-between">
        <h5>{`Experience: ${experienceRating} stars`}</h5>
        <h5>{`Value fo money: ${valueRating} stars`}</h5>
        <h5>{`Comport: ${comfortRating} stars`}</h5>
      </div>
      <div className="mb-2 mt-2">{review}</div>
      <div>{`Posted at: ${toDateTime(timestamp.seconds).toDateString()}`}</div>
    </div>
  );
};
