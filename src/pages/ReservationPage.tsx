import Sidebar from "@/layout/Sidebar";
import Calendar, { CalendarProps } from "react-calendar";
import PageHeader from "@/components/PageHeader";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useGetReservationApartmentsQuery } from "@/api/api";
import { IReservation } from "@/interfaces/ReservationInterface";
import { OnArgs, TileArgs } from "react-calendar/src/shared/types";
import { useCallback, useMemo } from "react";
import { getColorFromUUID } from "@/utils/functions";

interface DateHighlight {
  date: Date;
  reservationId: string;
  isFirst: boolean;
  isLast: boolean;
  clientName: string;
}

const highlightDates = (reservations: IReservation[]): DateHighlight[] => {
  let dates: DateHighlight[] = [];
  reservations.forEach((reservation) => {
    let start = new Date(reservation.startDate);
    let end = new Date(reservation.endDate);
    let current = new Date(reservation.startDate);

    while (current <= end) {
      dates.push({
        date: new Date(current),
        reservationId: reservation.reservationId,
        clientName: reservation.clientName,
        isFirst: current.toDateString() === start.toDateString(),
        isLast: current.toDateString() === end.toDateString(),
      });
      current.setDate(current.getDate() + 1);
    }
  });
  return dates;
};
const ReservationPage = () => {
  const { apartmentId } = useParams();
  if (!apartmentId) return;
  const { data, isLoading } = useGetReservationApartmentsQuery(apartmentId);
  const highlightedDates = useMemo(() => {
    if (data) return highlightDates(data);
    return [];
  }, [data]);

  const tileContent = ({ date, view }: TileArgs) => {
    if (view === "month" && highlightedDates.length > 0) {
      const highlight = highlightedDates.find(
        (d) => d.date.toDateString() === date.toDateString(),
      );
      if (highlight) {
        if (highlight.isFirst && highlight.isLast)
          return (
            <a
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/${apartmentId}/reservations/${highlight.reservationId}/edit`}
              className="calendar__highlight first-date last-date"
              style={{
                opacity: 0.7,
                backgroundColor: getColorFromUUID(highlight.reservationId),
              }}
            >
              {highlight.clientName}
            </a>
          );

        if (highlight.isFirst)
          return (
            <a
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/${apartmentId}/reservations/${highlight.reservationId}/edit`}
              className="calendar__highlight first-date"
              style={{
                opacity: 0.7,
                backgroundColor: getColorFromUUID(highlight.reservationId),
              }}
            >
              {highlight.clientName}
            </a>
          );

        if (highlight.isLast)
          return (
            <a
              onClick={(e) => {
                e.stopPropagation();
              }}
              href={`/${apartmentId}/reservations/${highlight.reservationId}/edit`}
              className="calendar__highlight last-date"
              style={{
                opacity: 0.7,
                backgroundColor: getColorFromUUID(highlight.reservationId),
              }}
            />
          );

        return (
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
            href={`/${apartmentId}/reservations/${highlight.reservationId}/edit`}
            className="calendar__highlight"
            style={{
              opacity: 0.7,
              backgroundColor: getColorFromUUID(highlight.reservationId),
            }}
          />
        );
      }
    }
    return null;
  };

  return (
    <Sidebar>
      <PageHeader title={"Reservations"}>
        <a href={`/${apartmentId}/reservations/new`}>
          <FaPlus />
          Add new
        </a>
      </PageHeader>
      <>
        {!isLoading && (
          <Calendar className={"calendar"} tileContent={tileContent} />
        )}
      </>
    </Sidebar>
  );
};

export default ReservationPage;
