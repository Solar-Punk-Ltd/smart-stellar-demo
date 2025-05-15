import { create } from "zustand";
import {PassKey} from "@solarpunkltd/passkey"

interface State {
  showAuth: boolean;
  passKey: PassKey | null;
}

interface Actions {
  setShowAuth: (keyId: State["showAuth"]) => void;
  setPassKey: (passKey: State["passKey"]) => void;
}

export const useAuthStore = create<State & Actions>((set) => ({
  showAuth: false,
  passKey: null,
  setShowAuth: (showAuth) => set(() => ({ showAuth })),
  setPassKey: (passKey) => set(() => ({ passKey })),
}));
