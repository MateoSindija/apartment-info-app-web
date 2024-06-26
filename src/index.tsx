import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import ProtectedRoutes from "./components/ProtectedRoutes";
import NewItemPage from "./pages/NewItemPage";
import ListPage from "./pages/ListPage";
import MessagesPage from "./pages/MessagesPage";
import ReviewsPage from "./pages/ReviewsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignInPage />,
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: "/beaches",
        element: <ListPage urlType="beaches" type="Beaches" />,
      },
      {
        path: "/messages",
        element: <MessagesPage />,
      },
      {
        path: "/restaurants",
        element: <ListPage urlType="restaurants" type="Restaurants" />,
      },
      {
        path: "/shops",
        element: <ListPage urlType="shops" type="Shops" />,
      },
      {
        path: "/attractions",
        element: <ListPage urlType="attractions" type="Attractions" />,
      },
      {
        path: "/devices",
        element: <ListPage urlType="devices" type="Devices" />,
      },
      {
        path: "/reviews",
        element: <ReviewsPage />,
      },
      {
        path: "/beaches/new",
        element: <NewItemPage type="beach" />,
      },
      {
        path: "/beaches/edit/:id",
        element: <NewItemPage type="beach" />,
      },
      {
        path: "/restaurants/new",
        element: <NewItemPage type="restaurant" />,
      },
      {
        path: "/restaurants/edit/:id",
        element: <NewItemPage type="restaurant" />,
      },
      {
        path: "/shops/new",
        element: <NewItemPage type="shop" />,
      },
      {
        path: "/shops/edit/:id",
        element: <NewItemPage type="shop" />,
      },
      {
        path: "/attractions/new",
        element: <NewItemPage type="attraction" />,
      },
      {
        path: "/attractions/edit/:id",
        element: <NewItemPage type="attraction" />,
      },
      {
        path: "/devices/new",
        element: <NewItemPage type="device" />,
      },

      {
        path: "/devices/edit/:id",
        element: <NewItemPage type="device" />,
      },
      {
        path: "/aboutUs/edit",
        element: <NewItemPage type="aboutUs" />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
