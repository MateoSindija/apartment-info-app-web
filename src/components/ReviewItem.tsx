import React from "react";
import { IReview } from "../interfaces/NewItemInterface";

export const ReviewItem = ({
  id,
  review,
  timestamp,
  user,
  rating,
}: IReview) => {
  const toDateTime = (secs) => {
    var t = new Date(Date.UTC(1970, 0, 1)); // Epoch
    t.setUTCSeconds(secs);
    return t;
  };
  return (
    <div className="rounded shadow-sm p-2">
      <div className="d-flex justify-content-between">
        <h4>{user}</h4>
        <h4>{`${rating} stars`}</h4>
      </div>
      <div className="mb-2 mt-2">{review}</div>
      <div>{`Posted at: ${toDateTime(timestamp.seconds).toDateString()}`}</div>
    </div>
  );
};
