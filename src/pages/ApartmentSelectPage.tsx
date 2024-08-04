import React, { useState } from "react";
import { useGetApartmentsQuery } from "@/api/api";
import ApartmentCard from "@/components/cards/ApartmentCard";
import { FaPlus } from "react-icons/fa";
import Modal from "@/components/modal/Modal";
import NewApartmentForm from "@/components/NewApartmentForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/redux/user";
import { persistor } from "@/redux/store";

const CROSS_COLOR = "#dee2e6";
const CROSS_SIZE = 40;
const ApartmentSelectPage = () => {
  const { data } = useGetApartmentsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSignOut = () => {
    dispatch(logout());
    persistor.purge();
    navigate("/", { replace: true });
  };

  return (
    <div className={"apartmentList"}>
      <div className={"apartmentList__header"}>
        <h3>Select apartment or add a new one</h3>
        <button onClick={handleSignOut}>Sign out</button>
      </div>
      <div className={"apartmentList__list"}>
        {data?.apartments?.map((apartment) => {
          return <ApartmentCard key={apartment.apartmentId} {...apartment} />;
        })}
        <button
          className={"apartmentList__add"}
          onClick={() => setIsModalOpen(true)}
        >
          <FaPlus color={CROSS_COLOR} size={CROSS_SIZE} />
          <div className={"apartmentList__add__text"}>Add apartment</div>
        </button>
      </div>
      <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <NewApartmentForm setIsModalOpen={setIsModalOpen} />
      </Modal>
    </div>
  );
};

export default ApartmentSelectPage;
