import React, { useEffect, useMemo } from "react";
import Sidebar from "@/layout/Sidebar";
import PageHeader from "@/components/PageHeader";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { INewReservation } from "@/interfaces/ReservationInterface";
import { NewReservationSchema } from "@/schemas/ReservationSchema";
import DatePicker from "react-datepicker";
import { formatDateString } from "@/utils/functions";
import {
  useAddReservationMutation,
  useDeleteReservationMutation,
  useGetReservationApartmentsQuery,
  useGetReservationInfoQuery,
  useUpdateReservationMutation,
} from "@/api/api";
import { useNavigate, useParams } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { TOAST_CLOSE_TIME_MS } from "@/utils/constants";

const NewReservationPage = () => {
  const { apartmentId, reservationId } = useParams();
  if (!apartmentId) return;
  const navigate = useNavigate();
  const now = new Date();

  const { data } = reservationId
    ? useGetReservationInfoQuery(reservationId)
    : { data: undefined };

  const { data: reservationData } =
    useGetReservationApartmentsQuery(apartmentId);

  const [addReservation] = useAddReservationMutation();
  const [updateReservation] = useUpdateReservationMutation();
  const [deleteReservation] = useDeleteReservationMutation();

  useEffect(() => {
    if (data) {
      setValue("startDate", data.startDate);
      setValue("endDate", data.endDate);
      setValue("clientName", data.clientName);
    } else {
      setValue("startDate", now);
      setValue("endDate", new Date(new Date(now).setDate(now.getDate() + 1)));
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    watch,
    reset,
    getValues,
    clearErrors,
  } = useForm<INewReservation>({
    resolver: zodResolver(NewReservationSchema),
    defaultValues: {
      apartmentId: apartmentId,
    },
  });

  const isEditPage = () => {
    return data !== undefined;
  };

  const handleAddReservation = async (data: INewReservation) => {
    try {
      await addReservation(data);
      navigate(`/${apartmentId}/reservations`);
      toast.success("Reservation added", {
        position: "top-center",
        autoClose: TOAST_CLOSE_TIME_MS,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (e) {
      console.log(e);
    }
    reset();
  };
  const handleUpdateReservation = async (data: INewReservation) => {
    if (!reservationId) return;
    try {
      await updateReservation({ data: data, id: reservationId });
      navigate(`/${apartmentId}/reservations`);
      toast.success("Reservation updated", {
        position: "top-center",
        autoClose: TOAST_CLOSE_TIME_MS,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async () => {
    if (!reservationId) return;
    try {
      await deleteReservation(reservationId);
      navigate(`/${apartmentId}/reservations`);
      toast.success("Reservation deleted", {
        position: "top-center",
        autoClose: TOAST_CLOSE_TIME_MS,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getExcludedDates = () => {
    if (!reservationData) return [];
    const dates: Date[] = [];
    reservationData.forEach((reservation) => {
      let start = new Date(reservation.startDate);
      let end = new Date(reservation.endDate);
      while (start <= end) {
        // Only exclude dates that are not part of the current reservation
        if (reservation.reservationId !== reservationId) {
          dates.push(new Date(start));
        }
        start.setDate(start.getDate() + 1);
      }
    });
    return dates;
  };

  const excludedDates = useMemo(() => {
    return getExcludedDates();
  }, [reservationData]);

  return (
    <Sidebar>
      <PageHeader
        title={isEditPage() ? "Edit reservation" : "Add new reservation"}
      >
        {isEditPage() ? (
          <div className={"controlButtons"}>
            <button type="submit" form={"reservationForm"}>
              <FaCheck />
              Save
            </button>
            <button
              type={"button"}
              className={"controlButtons__delete"}
              onClick={handleDelete}
            >
              <FaTrash />
              Delete
            </button>
          </div>
        ) : (
          <button type="submit" form={"reservationForm"}>
            <FaPlus />
            Add
          </button>
        )}
      </PageHeader>
      <form
        className={"reservationForm"}
        id={"reservationForm"}
        onSubmit={handleSubmit(
          isEditPage() ? handleUpdateReservation : handleAddReservation,
        )}
      >
        <div className={"reservationForm__upper"}>
          <div className={"reservationForm__upper__container"}>
            <label htmlFor="start">Start date</label>
            <DatePicker
              placeholderText={"Select check in hour"}
              id={"start"}
              selected={watch("startDate")}
              excludeDates={excludedDates}
              value={formatDateString(watch("startDate")?.toString())}
              onChange={(date) => setValue("startDate", date ?? new Date())}
            />
          </div>
          <div className={"reservationForm__upper__container"}>
            <label htmlFor="end">End date</label>
            <DatePicker
              placeholderText={"Select check out hour"}
              id={"end"}
              selected={watch("endDate")}
              excludeDates={excludedDates}
              value={formatDateString(watch("endDate")?.toString())}
              onChange={(date) => setValue("endDate", date ?? new Date())}
            />
          </div>
        </div>
        <div className={"reservationForm__lower"}>
          <label htmlFor="name">Client Name</label>
          <input
            {...register("clientName")}
            id={"name"}
            placeholder={"Enter you client name"}
          />
        </div>
      </form>
    </Sidebar>
  );
};

export default NewReservationPage;
