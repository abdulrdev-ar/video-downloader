"use client";

import { useRef, useState, type FormEvent } from "react";

import { CloseIcon, PasteIcon, Spinner } from "@/components/icon/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LinkInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  busy?: boolean;
  placeholder: string;
  submitLabel: string;
  busyLabel?: string;
  error?: string | null;
}

/** Link field with a Paste/Clear toggle. Clipboard access is only asked for when Paste is pressed. */
export default function LinkInput({
  value,
  onChange,
  onSubmit,
  busy = false,
  placeholder,
  submitLabel,
  busyLabel = "Mengambil...",
  error,
}: LinkInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [clipboardNote, setClipboardNote] = useState("");
  const hasValue = value.trim().length > 0;

  const pasteOrClear = async () => {
    setClipboardNote("");
    if (hasValue) {
      onChange("");
    } else {
      try {
        const text = (await navigator.clipboard.readText()).trim();
        if (text) onChange(text);
        else setClipboardNote("Clipboard kosong. Salin tautannya dulu.");
      } catch {
        setClipboardNote(
          "Browser tidak mengizinkan akses clipboard. Tempel manual dengan tekan lama di kolom."
        );
      }
    }
    inputRef.current?.focus();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (hasValue && !busy) onSubmit();
  };

  const message = error ?? clipboardNote;
  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      <label htmlFor="tautan" className="text-sm font-medium">
        Tautan post
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          ref={inputRef}
          id="tautan"
          type="url"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={message ? "tautan-pesan" : undefined}
          className="sm:flex-1"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={pasteOrClear}
            disabled={busy}
          >
            {hasValue ? <CloseIcon /> : <PasteIcon />}
            {hasValue ? "Hapus" : "Tempel"}
          </Button>
          <Button
            type="submit"
            disabled={!hasValue || busy}
            className="flex-1 sm:flex-none"
          >
            {busy && <Spinner />}
            {busy ? busyLabel : submitLabel}
          </Button>
        </div>
      </div>
      {message && (
        <p
          id="tautan-pesan"
          role={error ? "alert" : "status"}
          className={
            error ? "text-sm text-destructive" : "text-sm text-muted-foreground"
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
