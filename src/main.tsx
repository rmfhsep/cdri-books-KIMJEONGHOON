import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/lib/queryClient";
import "@/index.css";
import { PATHS } from "@/shared/constants/paths";
import App from "@/App";

// 루트(/)는 기록을 남기지 않고 검색 화면으로 보낸다.
if (window.location.pathname === PATHS.home)
  window.history.replaceState(null, "", PATHS.search);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
