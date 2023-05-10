import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import AuthenticatorPopup from "./Auth/AuthenticatorPopup";
import Redirect from "./Auth/Redirect";
import Authenticator from "./Auth/Authenticator";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Authenticator>
        <App />
      </Authenticator>
    ),
  },
  {
    path: "/redirect",
    element: <Redirect />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
