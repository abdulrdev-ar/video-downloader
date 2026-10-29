import type { HistoryState, StoreSlice } from "../types";

const MAX_ENTRIES = 100;

export const createHistorySlice: StoreSlice<HistoryState> = (set) => ({
  history: {
    context: { entries: [] },
    actions: {
      add: (entry) => {
        set((state) => ({
          history: {
            ...state.history,
            context: {
              ...state.history.context,
              entries: [
                { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
                ...state.history.context.entries,
              ].slice(0, MAX_ENTRIES),
            },
          },
        }));
      },
      remove: (id) => {
        set((state) => ({
          history: {
            ...state.history,
            context: {
              ...state.history.context,
              entries: state.history.context.entries.filter(
                (entry) => entry.id !== id
              ),
            },
          },
        }));
      },
      flush: () => {
        set((state) => ({
          history: { ...state.history, context: { entries: [] } },
        }));
      },
    },
  },
});
