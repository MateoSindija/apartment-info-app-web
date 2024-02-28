import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout.tsx";
import { Button, ListGroup } from "react-bootstrap";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase.ts";
import {
  INewBasicWithPostion,
  INewBeach,
  INewDevice,
  INewRestaurant,
} from "../interfaces/NewItemInterface.ts";
import { deleteObject, getStorage, ref } from "@firebase/storage";
import { date } from "zod";

interface IProps {
  type: string;
  urlType: string;
}

type PossibleInterfaces =
  | INewBeach
  | INewRestaurant
  | INewBasicWithPostion
  | INewDevice;

const ListPage = ({ type, urlType }: IProps) => {
  const navigate = useNavigate();
  const [list, setList] = useState<PossibleInterfaces[]>([]);
  const getData = async () => {
    let newData: PossibleInterfaces[] = [];
    const querySnapshot = await getDocs(collection(db, type));
    querySnapshot.forEach((doc) => {
      const data = doc.data() as PossibleInterfaces;

      if ("terrainType" in data) {
        newData.push({ ...(data as INewBeach), id: doc.id });
      } else if ("review" in data) {
        newData.push({ ...(data as INewRestaurant), id: doc.id });
      } else if ("lat" in data) {
        newData.push({ ...(data as INewBasicWithPostion), id: doc.id });
      } else if ("title" in data) {
        newData.push({ ...(data as INewDevice), id: doc.id });
      }
    });
    setList(newData);
  };
  useEffect(() => {
    getData();
  }, []);

  const handleDelete = async (id: string, imagesUrl: string[]) => {
    imagesUrl.forEach(async (imageUrl) => {
      await deleteObject(ref(getStorage(), imageUrl));
    });
    await deleteDoc(doc(db, type, id));
    getData();
  };

  return (
    <Layout>
      <>
        <div>
          <Button className="mt-3" onClick={() => navigate(`/${urlType}/new`)}>
            Add new {type}
          </Button>
        </div>
        <ListGroup as="ul" className="mt-3">
          {list.map((item) => {
            return (
              <ListGroup.Item
                key={item.id}
                as="li"
                className="d-flex align-items-center"
              >
                <div>{item.title}</div>
                <div className="ms-auto">
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDelete(item.id ?? "", item.imagesUrl ?? [])
                    }
                  >
                    Delete
                  </Button>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    </Layout>
  );
};

export default ListPage;
