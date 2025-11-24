// components/ClientProviders.js
"use client";

import { AuthProvider } from "@/context/AuthContext";
import { Provider } from "react-redux";
import { store } from "../store";




export default function ClientProviders({ children }) {

    
  return (
    <AuthProvider>
      <Provider store={store}>{children}</Provider>
    </AuthProvider>
  );
}
