import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoriteProvider } from "./context/FavoriteContext";
import { NotificationProvider } from "./context/NotificationContext";

import "./index.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <FavoriteProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </FavoriteProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
