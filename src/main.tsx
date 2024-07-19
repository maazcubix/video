import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AgoraRTCProvider client={client}>
      <App />
    </AgoraRTCProvider>{" "}
  </React.StrictMode>
);
