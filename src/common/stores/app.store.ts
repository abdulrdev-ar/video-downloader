import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import { createHistorySlice } from "./slice";
import type { AppState, HistoryContext } from "./types";

interface PersistedState {
  history?: { context?: Partial<HistoryContext> };
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (...a) => ({
        ...createHistorySlice(...a),
      }),
      {
        name: "app-store",
        storage: createJSONStorage(() => localStorage),
        // Rehydrated from ClientEnhancements after mount, so SSR markup matches.
        skipHydration: true,
        partialize: (state) => ({
          history: { context: state.history.context },
        }),
        // partialize writes a partial shape; merge contexts only so actions survive.
        merge: (persisted, current) => {
          const saved = persisted as PersistedState | undefined;
          return {
            ...current,
            history: {
              ...current.history,
              context: {
                ...current.history.context,
                ...saved?.history?.context,
              },
            },
          };
        },
      }
    ),
    { enabled: process.env.NODE_ENV === "development" }
  )
);
