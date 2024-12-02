"use client";
import React, { useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { FileSaveContext } from "../_context/FileSaveContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
function Provider({ children }) {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined in the environment variables.");
  }

  const convex = new ConvexReactClient(convexUrl);


  return (
    <div>
      <ConvexProvider client={convex}>
        <PayPalScriptProvider options={{clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}}>
        {children}
      </PayPalScriptProvider>
      </ConvexProvider>
    </div>
  );
}

export default Provider;
