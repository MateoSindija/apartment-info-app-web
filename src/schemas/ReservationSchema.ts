import { z, ZodType } from "zod";
import { INewReservation } from "@/interfaces/ReservationInterface";

export const NewReservationSchema: ZodType<INewReservation> = z
  .object({
    clientName: z.string().min(2).max(20),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    apartmentId: z.string().uuid(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be greater than start date",
    path: ["endDate"], // optional: specifies which field to apply the error to
  });
