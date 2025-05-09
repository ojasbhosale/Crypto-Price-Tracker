"use client";

import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Provider } from "react-redux";
import { store } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" enableSystem defaultTheme="system">
        {children}
      </ThemeProvider>
    </Provider>
  );
}
