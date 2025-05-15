"use client";

import Header from "./components/Header";
import Welcome from "./components/Welcome";

import { AuthProvider } from "@solarpunkltd/passkey";
import { useAuthStore } from "./store/auth";
import { Key } from "@solarpunkltd/passkey-kit";

export default function Home() {
  const showAuth = useAuthStore((state) => state.showAuth);
  const setPassKey = useAuthStore((state) => state.setPassKey);

  const onCreate = (passKey: Key) => {
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
