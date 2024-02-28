import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import SignInPage from "./pages/SignInPage.tsx";
import ProtectedRoutes from "./components/ProtectedRoutes.tsx";
import NewItemPage from "./pages/NewItemPage.tsx";
import ListPage from "./pages/ListPage.tsx";
import MessagesPage from "./pages/MessagesPage.tsx";
import ReviewsPage from "./pages/ReviewsPage.tsx";

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
        path: "/restaurants/new",
        element: <NewItemPage type="restaurant" />,
      },
      {
        path: "/shops/new",
        element: <NewItemPage type="shop" />,
      },
      {
        path: "/attractions/new",
        element: <NewItemPage type="attraction" />,
      },
      {
        path: "/devices/new",
        element: <NewItemPage type="device" />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
