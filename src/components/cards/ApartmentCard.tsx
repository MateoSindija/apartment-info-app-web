import React, { useMemo, useState } from "react";
import { IApartment } from "@/interfaces/ApartmentIntefaces";
import { MdApartment } from "react-icons/md";

const ApartmentCard = ({ apartmentId, name, address }: IApartment) => {
  return (
    <a className={"apartmentCard"} href={`/${apartmentId}/restaurants`}>
      <div className={"apartmentCard__frame"}>
        <MdApartment size={100} color={"#dee2e6"} />
      </div>
      <div className={"apartmentCard__name"}>{name}</div>
      <div className={"apartmentCard__address"}>{address.split(",")[0]}</div>
    </a>
  );
};

export default ApartmentCard;
