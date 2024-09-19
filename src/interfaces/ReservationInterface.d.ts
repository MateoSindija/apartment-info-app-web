export interface INewReservation {
  startDate: Date;
  endDate: Date;
  clientName: string;
  apartmentId: string;
}
export interface IReservation {
  reservationId: string;
  startDate: Date;
  endDate: Date;
  clientName: string;
}
