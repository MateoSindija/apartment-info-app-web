import React, { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetReservationApartmentsQuery } from "@/api/api";
import { formatDateString } from "@/utils/functions";

interface IProps {
  setReservationId: (reservationId: string) => void;
  setClientName: (clientName: string) => void;
  setEndsAt: (endsAt: Date) => void;
  setIsConversationClosed: (isConversationClosed: boolean) => void;
  children: JSX.Element[] | JSX.Element;
}
const MessageSidebar = ({
  setReservationId,
  children,
  setClientName,
  setIsConversationClosed,
  setEndsAt,
}: IProps) => {
  const { apartmentId } = useParams();
  if (!apartmentId) return null;

  const { data: reservationData } =
    useGetReservationApartmentsQuery(apartmentId);
  const activeReservation = useMemo(() => {
    return reservationData?.find((reservation) => {
      const startDate = new Date(reservation.startDate).toLocaleDateString();
      const endDate = new Date(reservation.endDate).toLocaleDateString();
      const now = new Date().toLocaleDateString();
      return startDate <= now && endDate >= now;
    });
  }, [reservationData]);

  useEffect(() => {
    if (activeReservation) {
      setReservationId(activeReservation.reservationId);
      setClientName(activeReservation.clientName);
      setEndsAt(activeReservation.endDate);
    }
  }, [activeReservation]);

  const pastReservation = useMemo(() => {
    const now = new Date().toLocaleDateString();
    return reservationData?.filter((reservation) => {
      const endDate = new Date(reservation.endDate).toLocaleDateString();
      return endDate < now;
    });
  }, [reservationData]);

  const handleClick = (
    clickedReservationId: string,
    clickedReservationClientName: string,
    isFromPastReservation: boolean,
    endDate: Date,
  ) => {
    setReservationId(clickedReservationId);
    setClientName(clickedReservationClientName);
    setIsConversationClosed(isFromPastReservation);
    setEndsAt(endDate);
  };

  return (
    reservationData && (
      <div className="messageSidebar">
        <div className="messageSidebar__sidebar">
          <div className="messageSidebar__sidebar__group">Active Messages</div>
          <button
            className="messageSidebar__sidebar__item"
            onClick={() =>
              handleClick(
                activeReservation?.reservationId ?? "",
                activeReservation?.clientName ?? "",
                false,
                activeReservation?.endDate ?? new Date(),
              )
            }
          >
            {activeReservation?.clientName}
          </button>
          <div className="messageSidebar__sidebar__group">
            <span className="messageSidebar__sidebar__group__finished">
              Finished Messages
            </span>
            <span className="messageSidebar__sidebar__group__length">
              {pastReservation?.length}
            </span>
          </div>

          {pastReservation?.map((reservation) => {
            return (
              <button
                className="messageSidebar__sidebar__item"
                onClick={() =>
                  handleClick(
                    reservation.reservationId,
                    reservation.clientName,
                    true,
                    reservation.endDate,
                  )
                }
                key={reservation.reservationId}
              >
                {reservation.clientName}
              </button>
            );
          })}
        </div>
        <div className="messageSidebar__content">{children}</div>
      </div>
    )
  );
};

export default MessageSidebar;
