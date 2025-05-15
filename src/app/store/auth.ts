import { create } from "zustand";
import { Key } from '@solarpunkltd/passkey-kit';


interface State {
  showAuth: boolean;
  passKey: Key | null;
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
