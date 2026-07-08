import { create } from "zustand";
import MiniSearch from "minisearch";

interface WordBank {
  minisearch: MiniSearch | null;
  ready: boolean;
  load: (userAuthToken: string) => Promise<void>;
}

export const useWordBank = create<WordBank>((set) => ({
  minisearch: null,
  ready: false,
  load: async (userAuthToken: string) => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}/word-bank`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userAuthToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to load known words");
    }

    const words = await response.json();

    const minisearch = new MiniSearch({
      fields: ["word", "translation"],
      storeFields: ["word", "translation"],
    });

    minisearch.addAll(words);

    set({ minisearch, ready: true });
  },
}));
