import { create } from "zustand";
import { Key } from '@solarpunkltd/passkey-kit';


interface State {
  showAuth: boolean;
  key: Key | null;
}

interface Actions {
  setShowAuth: (keyId: State["showAuth"]) => void;
  setKey: (key: State["key"]) => void;
}

export const useAuthStore = create<State & Actions>((set) => ({
  showAuth: false,
  key: null,
  setShowAuth: (showAuth) => set(() => ({ showAuth })),
  setKey: (key) => set(() => ({ key })),
}));
