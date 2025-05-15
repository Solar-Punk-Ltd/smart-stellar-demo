import { create } from "zustand";

export interface PassKey {
  name: string;
  keyId: Buffer;
  keyIdBase64: string;
  publicKey: Buffer;
}

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
