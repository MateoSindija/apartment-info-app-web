import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import { FaPlus } from "react-icons/fa";
import {
  useDeleteBeachMutation,
  useDeleteDeviceMutation,
  useDeleteRestaurantMutation,
  useDeleteShopMutation,
  useDeleteSightMutation,
  useGetBeachApartmentsQuery,
  useGetDeviceApartmentsQuery,
  useGetRestaurantApartmentsQuery,
  useGetShopApartmentsQuery,
  useGetSightApartmentsQuery,
} from "@/api/api";
import AttractionList from "@/components/lists/AttractionList";
import PageHeader from "@/components/PageHeader";

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
      <PageHeader
        title={type[0].toUpperCase() + type.slice(1)}
        entriesNumber={data?.length}
      >
        <a href={`/${apartmentId}/${type.toLowerCase()}/new`}>
          <FaPlus />
          Add new
        </a>
      </PageHeader>

      <AttractionList data={data} type={type} />
    </Sidebar>
  );
};

export default ListPage;
