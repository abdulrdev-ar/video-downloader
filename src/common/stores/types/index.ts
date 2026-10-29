import type { StateCreator } from "zustand";

import type { AppState } from "./merge-state";

export * from "./history";
export type { AppState } from "./merge-state";

export type StoreSlice<T> = StateCreator<AppState, [], [], T>;
