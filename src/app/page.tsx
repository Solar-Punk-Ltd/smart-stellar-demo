"use client";

import Header from "./components/Header";
import Welcome from "./components/Welcome";

import { AuthProvider } from "@solarpunkltd/passkey";
import { PassKey, useAuthStore } from "./store/auth";

export default function Home() {
  const showAuth = useAuthStore((state) => state.showAuth);
  const setPassKey = useAuthStore((state) => state.setPassKey);

  const onCreate = (passKey: PassKey) => {
    setPassKey(passKey);
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {showAuth && (
        <AuthProvider domain="http://localhost:5173" onCreate={onCreate} />
      )}
      <Header />
      <Welcome />
    </div>
  );
}
