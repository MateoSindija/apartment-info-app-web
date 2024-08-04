import React from "react";
import Sidebar from "@/layout/Sidebar";
import PageHeader from "@/components/PageHeader";
import { FaCheck } from "react-icons/fa6";
import NewApartmentForm from "@/components/NewApartmentForm";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetApartmentInfoQuery } from "@/api/api";

const ApartmentInfoPage = () => {
  const { apartmentId } = useParams();
  if (!apartmentId) return null;
  const { data: apartmentInfo } = useGetApartmentInfoQuery(apartmentId);

  return (
    <Sidebar>
      <PageHeader title={"Apartment info"}>
        <button type="submit" form={"apartmentForm"}>
          <FaCheck />
          Save
        </button>
      </PageHeader>
      <>
        {apartmentInfo && (
          <div className={"apartmentInfo"}>
            <div className={"apartmentInfo__id"}>
              <div className={"apartmentInfo__id__title"}>
                Apartment Identification
              </div>
              <div className={"apartmentInfo__id__value"}>
                {apartmentInfo.apartmentId}
              </div>
            </div>
            <NewApartmentForm data={apartmentInfo} apartmentId={apartmentId} />
          </div>
        )}
      </>
    </Sidebar>
  );
};

export default ApartmentInfoPage;
