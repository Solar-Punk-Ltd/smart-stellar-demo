"use client";

import Header from "./components/Header";
import Welcome from "./components/Welcome";

import { AuthProvider } from "@solarpunkltd/passkey";
import { useAuthStore } from "./store/auth";
import { Key } from "@solarpunkltd/passkey-kit";

export default function Home() {
  const showAuth = useAuthStore((state) => state.showAuth);
  const setKey = useAuthStore((state) => state.setKey);

  const onCreate = (key: Key) => {
    setKey(key);
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
