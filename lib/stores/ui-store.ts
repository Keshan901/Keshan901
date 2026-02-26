import { create } from "zustand";

type UIState = {
  copiedText: string | null;
  setCopiedText: (text: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  copiedText: null,
  setCopiedText: (text) => set({ copiedText: text }),
}));
