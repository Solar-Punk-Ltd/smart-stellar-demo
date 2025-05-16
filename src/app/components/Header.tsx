"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { account } from "../utils/passkey-kit";
import { useKeyIdStore } from "../store/keyId";
import { useContractIdStore } from "../store/contractId";
import { truncate } from "../utils/base";
import { useAuthStore } from "../store/auth";

export default function Header() {

  const contractId = useContractIdStore((state) => state.contractId);
  const updateContractId = useContractIdStore((state) => state.setContractId);

  const updateKeyId = useKeyIdStore((state) => state.setKeyId);

  const updateShowAuth = useAuthStore((state) => state.setShowAuth);
  const key = useAuthStore((state) => state.key);

  useEffect(() => {
    if (localStorage.hasOwnProperty("ssd:keyId")) {
      updateKeyId(localStorage.getItem("ssd:keyId")!);
    }

    return () => {};
  }, []);


  async function login() {
    updateShowAuth(true);

    if (key) {
      await account.connectWallet(key.keyId);
    }
  }


  async function logout() {
    updateContractId("");

    Object.keys(localStorage).forEach((key) => {
      if (key.includes("ssd:")) {
        localStorage.removeItem(key);
      }
    });

    Object.keys(sessionStorage).forEach((key) => {
      if (key.includes("ssd:")) {
        sessionStorage.removeItem(key);
      }
    });

    location.reload();
  }

  return (
    <div className="relative p-2 bg-lime-950 text-lime-500">
      <div className="flex items-center flex-wrap max-w-[1024px] mx-auto">
        <h1 className="flex text-xl">
          <Link href="/">Smart Stellar Demo</Link>
        </h1>

        <div className="flex items-center ml-auto">
          {contractId ? (
            <>
              <a
                className="mr-2 font-mono text-sm underline"
                href={
                  "https://stellar.expert/explorer/public/contract/" +
                  contractId
                }
                target="_blank"
              >
                {truncate(contractId, 4)}
              </a>
              <button
                className="text-lime-950 bg-lime-500 px-2 py-1 ml-2"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="underline mr-2" onClick={login}>
                Login
              </button>
              {/* <button
                className="text-lime-950 bg-lime-500 px-2 py-1 disabled:bg-gray-400"
                onClick={signUp}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create New Account"}
              </button> */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
