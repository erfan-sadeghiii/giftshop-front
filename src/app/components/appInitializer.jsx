"use client";

import { useDispatch, useSelector } from "react-redux";
import { fetchCart, selectCartEntities } from "../cartSlice";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";



export default function AppInitializer({ children }) {
  const dispatch = useDispatch();

   const {accessToken} = useAuth()

  useEffect(() => {
    
    
    dispatch(fetchCart(accessToken));
  }, [dispatch,accessToken]);

  return children;
}
