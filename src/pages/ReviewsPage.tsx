import React, { useEffect, useState } from "react";
import { IReview } from "../interfaces/NewItemInterface.ts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase.ts";
import Layout from "../components/Layout.tsx";
import { ListGroup } from "react-bootstrap";

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
            return (
              <ListGroup.Item
                key={item.id}
                as="li"
                className="d-flex align-items-center"
              >
                <div>{item.rating}</div>
                <div>{item.description}</div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    </Layout>
  );
};

export default ReviewsPage;
