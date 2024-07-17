import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/user";
import { persistor } from "@/redux/store";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { FaShoppingBasket, FaUmbrellaBeach } from "react-icons/fa";
import { IoPeopleSharp, IoRestaurant } from "react-icons/io5";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { FaMountainCity } from "react-icons/fa6";
import { MdApartment, MdRateReview } from "react-icons/md";
import { PiDevicesFill } from "react-icons/pi";
import { CiLogout } from "react-icons/ci";
import { RiLogoutBoxFill } from "react-icons/ri";
import { useGetApartmentInfoQuery } from "@/api/api";

interface IProps {
  children: JSX.Element[] | JSX.Element;
}
const ICON_COLOR_ACTIVE = "#464af5";
const ICON_COLOR_INACTIVE = "#8e8ea7";
const ICON_SIZE = 18;
const Sidebar = ({ children }: IProps) => {
  const { apartmentId } = useParams();
  const url = useLocation();
  const navigate = useNavigate();
  if (!apartmentId) return;
  const { data: apartmentInfo } = useGetApartmentInfoQuery(apartmentId);

  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/", { replace: true });
  };

  const handleIconColor = (btnType: string) => {
    const pageType = url.pathname.split("/");
    if (pageType.includes(btnType)) return ICON_COLOR_ACTIVE;
    return ICON_COLOR_INACTIVE;
  };

  return (
    <>
      <div className="layout">
        <aside className="layout__sidebar">
          <div className="layout__sidebar__info">
            <div className="layout__sidebar__info__name">
              {apartmentInfo?.name}
            </div>
            <div className="layout__sidebar__info__address">
              {apartmentInfo?.address.split(",")[0]}
            </div>
          </div>
          <div className="layout__sidebar__group">Sights</div>
          <a
            href={`/${apartmentId}/beaches`}
            className="layout__sidebar__item"
            style={{ color: handleIconColor("beaches") }}
          >
            <FaUmbrellaBeach
              color={handleIconColor("beaches")}
              size={ICON_SIZE}
            />
            Beaches
          </a>

          <a
            href={`/${apartmentId}/restaurants`}
            className="layout__sidebar__item"
            style={{ color: handleIconColor("restaurants") }}
          >
            <IoRestaurant
              color={handleIconColor("restaurants")}
              size={ICON_SIZE}
            />
            Restaurants
          </a>

          <a
            href={`/${apartmentId}/shops`}
            className="layout__sidebar__item"
            style={{ color: handleIconColor("shops") }}
          >
            <FaShoppingBasket
              color={handleIconColor("shops")}
              size={ICON_SIZE}
            />
            Shops
          </a>

          <a
            href={`/${apartmentId}/sights`}
            className="layout__sidebar__item"
            style={{ color: handleIconColor("sights") }}
          >
            <FaMountainCity
              color={handleIconColor("sights")}
              size={ICON_SIZE}
            />
            Sights
          </a>

          <a
            href={`/${apartmentId}/devices`}
            className="layout__sidebar__item"
            style={{ color: handleIconColor("devices") }}
          >
            <PiDevicesFill
              color={handleIconColor("devices")}
              size={ICON_SIZE}
            />
            Devices
          </a>

          <div className="layout__sidebar__group">Other</div>
          <a
            href={`/${apartmentId}/reviews`}
            className="layout__sidebar__item"
            style={{ color: handleIconColor("reviews") }}
          >
            <MdRateReview color={handleIconColor("reviews")} size={ICON_SIZE} />
            Reviews
          </a>

          <a
            href={`/${apartmentId}/messages`}
            className="layout__sidebar__item"
          >
            <BiSolidMessageSquareDetail
              color={handleIconColor("messages")}
              size={ICON_SIZE}
            />
            Messages
          </a>

          <a
            href={`/${apartmentId}/aboutUs/edit`}
            className="layout__sidebar__item"
            style={{ color: handleIconColor("aboutUs") }}
          >
            <IoPeopleSharp
              color={handleIconColor("aboutUs")}
              size={ICON_SIZE}
            />
            About Us
          </a>
          <div className="layout__sidebar__group">User</div>
          <a
            href={`/apartment-select`}
            className="layout__sidebar__item"
            style={{ color: ICON_COLOR_INACTIVE }}
          >
            <MdApartment color={ICON_COLOR_INACTIVE} size={ICON_SIZE} />
            Apartment select
          </a>
          <button
            onClick={() => logoutHandler()}
            className={"layout__sidebar__signOut"}
          >
            <RiLogoutBoxFill color={ICON_COLOR_INACTIVE} size={ICON_SIZE} />
            Sign out
          </button>
        </aside>
        <main className="layout__mainContent">{children}</main>
      </div>
    </>
  );
};

export default Sidebar;
