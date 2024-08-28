import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignInPage from "@/pages/SignInPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NewItemPage from "./pages/NewItemPage";
import ListPage from "./pages/ListPage";
import MessagesPage from "./pages/MessagesPage";
import ReviewsPage from "./pages/ReviewsPage";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "@/styles/index.scss";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import SignUpPage from "@/pages/SignUpPage";
import ApartmentSelectPage from "@/pages/ApartmentSelectPage";
import ReservationPage from "@/pages/ReservationPage";
import NewReservationPage from "@/pages/NewReservationPage";
import ApartmentInfoPage from "@/pages/ApartmentInfoPage";
import "react-toastify/dist/ReactToastify.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignInPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/:apartmentId/beaches",
        element: <ListPage type="beaches" />,
      },
      {
        path: "/apartment-select",
        element: <ApartmentSelectPage />,
      },
      {
        path: "/:apartmentId/messages",
        element: <MessagesPage />,
      },
      {
        path: "/:apartmentId/restaurants",
        element: <ListPage type="restaurants" />,
      },
      {
        path: "/:apartmentId/shops",
        element: <ListPage type="shops" />,
      },
      {
        path: "/:apartmentId/sights",
        element: <ListPage type="sights" />,
      },
      {
        path: "/:apartmentId/devices",
        element: <ListPage type="devices" />,
      },
      {
        path: "/:apartmentId/reviews",
        element: <ReviewsPage />,
      },
      {
        path: "/:apartmentId/beaches/new",
        element: <NewItemPage type="beaches" />,
      },
      {
        path: "/:apartmentId/beaches/edit/:id",
        element: <NewItemPage type="beaches" />,
      },
      {
        path: "/:apartmentId/restaurants/new",
        element: <NewItemPage type="restaurants" />,
      },
      {
        path: "/:apartmentId/restaurants/edit/:id",
        element: <NewItemPage type="restaurants" />,
      },
      {
        path: "/:apartmentId/shops/new",
        element: <NewItemPage type="shops" />,
      },
      {
        path: "/:apartmentId/shops/edit/:id",
        element: <NewItemPage type="shops" />,
      },
      {
        path: "/:apartmentId/sights/new",
        element: <NewItemPage type="sights" />,
      },
      {
        path: "/:apartmentId/sights/edit/:id",
        element: <NewItemPage type="sights" />,
      },
      {
        path: "/:apartmentId/devices/new",
        element: <NewItemPage type="devices" />,
      },

      {
        path: "/:apartmentId/devices/edit/:id",
        element: <NewItemPage type="devices" />,
      },
      {
        path: "/:apartmentId/aboutUs/edit",
        element: <NewItemPage type="about us" />,
      },
      {
        path: "/:apartmentId/reservations",
        element: <ReservationPage />,
      },
      {
        path: "/:apartmentId/reservations/new",
        element: <NewReservationPage />,
      },
      {
        path: "/:apartmentId/reservations/:reservationId/edit",
        element: <NewReservationPage />,
      },
      {
        path: "/:apartmentId/apartment-info",
        element: <ApartmentInfoPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
