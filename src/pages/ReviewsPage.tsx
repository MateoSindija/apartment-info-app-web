import React, { useEffect, useState } from "react";
import { IReview } from "../interfaces/NewItemInterface";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.ts";
import Layout from "../components/Layout.tsx";
import { ListGroup } from "react-bootstrap";
import { ReviewItem } from "../components/ReviewItem.tsx";

const ReviewsPage = () => {
  const [list, setList] = useState<IReview[]>([]);
  const getData = async () => {
    let newData: IReview[] = [];
    const querySnapshot = await getDocs(collection(db, "Reviews"));
    querySnapshot.forEach((doc) => {
      const data = doc.data() as IReview;

      newData.push({ ...(data as IReview), id: doc.id });
    });
    setList(newData);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout>
      <>
        <ListGroup as="ul" className="mt-3">
          {list.map((item) => {
            return <ReviewItem key={item.id} {...item} />;
          })}
        </ListGroup>
      </>
    </Layout>
  );
};

export default ReviewsPage;
