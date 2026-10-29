import { useSyncExternalStore } from "react";

import { useAppStore } from "../app.store";

export const useHistory = () => useAppStore((state) => state.history.context);

export const useHistoryActions = () =>
  useAppStore((state) => state.history.actions);

/** False until saved history is read from localStorage, so pages can show loading instead of "empty". */
export const useHistoryHydrated = () =>
  useSyncExternalStore(
    (notify) => useAppStore.persist.onFinishHydration(notify),
    () => useAppStore.persist.hasHydrated(),
    () => false
  );
