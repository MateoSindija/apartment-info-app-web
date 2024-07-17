import React from "react";
import {
  IBeach,
  IDevice,
  INewBeach,
  IRestaurant,
  IShop,
  ISight,
} from "@/interfaces/NewItemInterface";
import { formatDateString } from "@/utils/functions";
import { FaPen, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";

interface IProps {
  data: IRestaurant[] | IBeach[] | ISight[] | IDevice[] | IShop[] | undefined;
  type: "devices" | "sights" | "shops" | "restaurants" | "beaches";
}
const ICON_COLOR = "#8D8DA8";
const ICON_SIZE = 18;

const handleId = (
  type: IProps["type"],
  data: IRestaurant | IBeach | IDevice | ISight | IShop,
) => {
  if ("restaurantId" in data) {
    return data.restaurantId;
  } else if ("beachId" in data) {
    return data.beachId;
  } else if ("deviceId" in data) {
    return data.deviceId;
  } else if ("sightId" in data) {
    return data.sightId;
  } else if ("shopId" in data) {
    return data.shopId;
  } else {
    return "";
  }
};

const AttractionList = ({ data, type }: IProps) => {
  const { apartmentId } = useParams();
  return (
    <div className={"listPage"}>
      <div className={"listPage__header"}>
        <div className={"listPage__header__title"}>Title</div>
        <div className={"listPage__header__date"}>Created at</div>
        <div className={"listPage__header__controls"}>Controls</div>
      </div>
      {data &&
        data.map((attraction) => {
          return (
            <div className={"listPage__row"} key={handleId(type, attraction)}>
              <div className={"listPage__row__title"}>{attraction.title}</div>
              <div className={"listPage__row__date"}>
                {formatDateString(attraction.createdAt)}
              </div>

              <div className={"listPage__row__controls"}>
                <button>
                  <FaTrash color={ICON_COLOR} size={ICON_SIZE} />
                </button>
                <a
                  href={`/${apartmentId}/${type}/edit/${handleId(type, attraction)}`}
                >
                  <FaPen color={ICON_COLOR} size={ICON_SIZE} />
                </a>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default AttractionList;
