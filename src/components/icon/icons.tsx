import type { ReactNode } from "react";

// Hand-drawn set with a heavier 2px stroke and square ends, so it reads closer
// to the ink-on-paper feel of the page than a thin rounded library set.
function Icon({
  children,
  className = "size-4",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="square"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

type IconProps = { className?: string };

export const DownloadIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />
  </Icon>
);

export const PasteIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 4h6v3H9zM7 5.5H5V21h14V5.5h-2" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Icon>
);

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);

export const AlertIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 8v5m0 3.5v.5M3.5 20h17L12 4z" />
  </Icon>
);

export const RetryIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4.5h4.5" />
  </Icon>
);

export const ChevronIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export function Spinner({ className = "size-4" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} animate-spin`}
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
