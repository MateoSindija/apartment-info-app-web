import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import { Button, ListGroup } from "react-bootstrap";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import {
  INewBasicWithPostion,
  INewBeach,
  INewDevice,
  INewRestaurant,
  PossibleInterfaces,
} from "../interfaces/NewItemInterface";
import { deleteObject, getStorage, ref } from "@firebase/storage";
import { FaPlus } from "react-icons/fa";
import {
  useGetBeachApartmentsQuery,
  useGetDeviceApartmentsQuery,
  useGetRestaurantApartmentsQuery,
  useGetShopApartmentsQuery,
  useGetSightApartmentsQuery,
} from "@/api/api";
import AttractionList from "@/components/lists/AttractionList";

interface IProps {
  type: "devices" | "sights" | "shops" | "restaurants" | "beaches";
}

const handleData = (type: IProps["type"], apartmentId: string) => {
  switch (type) {
    case "restaurants":
      return useGetRestaurantApartmentsQuery(apartmentId);
    case "beaches":
      return useGetBeachApartmentsQuery(apartmentId);
    case "devices":
      return useGetDeviceApartmentsQuery(apartmentId);
    case "shops":
      return useGetShopApartmentsQuery(apartmentId);
    case "sights":
      return useGetSightApartmentsQuery(apartmentId);
    default:
      return useGetRestaurantApartmentsQuery(apartmentId);
  }
};

const ListPage = ({ type }: IProps) => {
  const { apartmentId } = useParams();
  if (!apartmentId) return;
  const { data } = handleData(type, apartmentId);

  return (
    <Sidebar>
      <div className={"pageHeader"}>
        <div className={"pageHeader__title"}>
          {type[0].toUpperCase() + type.slice(1)}
          <div className={"pageHeader__title__subHeader"}>
            {data?.length} entries found
          </div>
        </div>

        <a href={`/${apartmentId}/${type.toLowerCase()}/new`}>
          <FaPlus />
          Add new
        </a>
      </div>
      <AttractionList data={data} type={type} />
    </Sidebar>
  );
};

export default ListPage;
