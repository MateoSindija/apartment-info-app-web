import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/user";
import { persistor } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { TbBeach } from "react-icons/tb";
import { GiPalmTree } from "react-icons/gi";
import { FaShoppingBasket, FaUmbrellaBeach } from "react-icons/fa";
import { IoPeopleSharp, IoRestaurant } from "react-icons/io5";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { FaMountainCity } from "react-icons/fa6";
import { MdRateReview } from "react-icons/md";
import { PiDevicesFill } from "react-icons/pi";

interface IProps {
  children: JSX.Element[] | JSX.Element;
}
const ICON_COLOR = "#464af5";
const ICON_SIZE = 18;
const Layout = ({ children }: IProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="layout">
        <aside className="layout__sidebar">
          <a href="/beaches" className="layout__sidebar__item">
            <FaUmbrellaBeach color={ICON_COLOR} size={ICON_SIZE} />
            Beaches
          </a>

          <a href="/restaurants" className="layout__sidebar__item">
            <IoRestaurant color={ICON_COLOR} size={ICON_SIZE} />
            Restaurants
          </a>

          <a href="/messages" className="layout__sidebar__item">
            <BiSolidMessageSquareDetail color={ICON_COLOR} size={ICON_SIZE} />
            Messages
          </a>

          <a href="/shops" className="layout__sidebar__item">
            <FaShoppingBasket color={ICON_COLOR} size={ICON_SIZE} />
            Shops
          </a>

          <a href="/attractions" className="layout__sidebar__item">
            <FaMountainCity color={ICON_COLOR} size={ICON_SIZE} />
            Sights
          </a>

          <a href="/reviews" className="layout__sidebar__item">
            <MdRateReview color={ICON_COLOR} size={ICON_SIZE} />
            Reviews
          </a>

          <a href="/devices" className="layout__sidebar__item">
            <PiDevicesFill color={ICON_COLOR} size={ICON_SIZE} />
            Devices
          </a>

          <a href="/aboutUs/edit" className="layout__sidebar__item">
            <IoPeopleSharp color={ICON_COLOR} size={ICON_SIZE} />
            About Us
          </a>

          <button onClick={() => logoutHandler()}>Sign out</button>
        </aside>
        <main className="layout__main-content">{children}</main>
      </div>
    </>
  );
};

export default Layout;
