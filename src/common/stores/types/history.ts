import type { PlatformType } from "@/common/lib/url-validators";

export interface HistoryEntry {
  id: string;
  url: string;
  platform: PlatformType;
  title: string;
  label: string;
  filename: string;
  timestamp: number;
}

export interface HistoryContext {
  entries: HistoryEntry[];
}

export interface HistoryAction {
  add: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  remove: (id: string) => void;
  flush: () => void;
}

export interface HistoryState {
  history: {
    context: HistoryContext;
    actions: HistoryAction;
  };
}
